// encrypt-stream.mjs
// Optional offsite-backup encryption for the Sovereign Ecosystem vault.
//
// This is a door, not a default. The shipped Council Chamber/scripts/backup-vault.mjs is
// local-to-local (vault to a local backup path) and needs no encryption as
// shipped. Wire this module in only once a Sovereign adds an offsite
// destination (a cloud object store, a remote drive, any place outside the
// controlled machine). At that point the outbound copy should leave the
// machine as ciphertext, because it may carry Council Chamber/scripts/.env, API keys and
// other credentials.
//
// If wired in: the vault archive is encrypted in-stream with AES-256-GCM
// before it leaves the machine for the offsite destination (Backblaze B2 and
// similar object stores are common choices; this module has no
// provider-specific code). The local backup on the controlled machine can
// stay plaintext for a fast local restore.
//
// Key management (the one manual step): the passphrase lives in
// BACKUP_ENCRYPTION_KEY in Council Chamber/scripts/.env for the automated encrypt. Because
// .env rides inside the encrypted archive, a real disaster restore (machine
// gone, pulling from the offsite destination) needs the passphrase from an
// independent place. Store a copy in a password manager. That is the only
// manual step.
//
// File format of the encrypted object (single stream, no temp file on disk):
//   MAGIC(4 "SEB1") | salt(16) | iv(12) | ciphertext(...) | authTag(16)
// scrypt derives the 32-byte key from passphrase + salt. GCM authenticates the
// whole payload; a wrong key or a tampered byte fails decryption loudly.

import crypto from 'crypto'
import { Transform } from 'stream'
import { readFileSync, writeFileSync } from 'fs'

const MAGIC = Buffer.from('SEB1', 'ascii')
const SALT_LEN = 16
const IV_LEN = 12
const TAG_LEN = 16
const KEY_LEN = 32

// True only when a non-empty passphrase is configured.
export function encryptionConfigPresent(env = process.env) {
  return typeof env.BACKUP_ENCRYPTION_KEY === 'string' && env.BACKUP_ENCRYPTION_KEY.trim().length > 0
}

function deriveKey(passphrase, salt) {
  return crypto.scryptSync(passphrase, salt, KEY_LEN)
}

// A Transform that encrypts its input stream. Emits the header (magic+salt+iv)
// ahead of the first ciphertext chunk and appends the GCM auth tag at the end.
// Proper backpressure: cipher output is pushed synchronously per chunk, the tag
// lands in _flush. Drop this between the archive source and the upload sink.
class EncryptTransform extends Transform {
  constructor(passphrase) {
    super()
    this._salt = crypto.randomBytes(SALT_LEN)
    this._iv = crypto.randomBytes(IV_LEN)
    this._cipher = crypto.createCipheriv('aes-256-gcm', deriveKey(passphrase, this._salt), this._iv)
    this._headerPushed = false
  }

  _pushHeader() {
    if (!this._headerPushed) {
      this.push(Buffer.concat([MAGIC, this._salt, this._iv]))
      this._headerPushed = true
    }
  }

  _transform(chunk, _enc, cb) {
    try {
      this._pushHeader()
      this.push(this._cipher.update(chunk))
      cb()
    } catch (err) {
      cb(err)
    }
  }

  _flush(cb) {
    try {
      this._pushHeader()
      this.push(this._cipher.final())
      this.push(this._cipher.getAuthTag())
      cb()
    } catch (err) {
      cb(err)
    }
  }
}

export function encryptTransform(passphrase) {
  if (!passphrase || !passphrase.trim()) throw new Error('encryptTransform requires a non-empty passphrase')
  return new EncryptTransform(passphrase)
}

// Decrypt an encrypted backup file to outPath. Restore is a manual, offline
// operation on a file already on disk, so buffering the whole payload is fine
// and lets us read the trailing auth tag before finalizing. Throws on a bad
// magic, wrong passphrase or tampered payload.
export function decryptFile({ inPath, outPath, passphrase }) {
  const data = readFileSync(inPath)
  if (data.length < MAGIC.length + SALT_LEN + IV_LEN + TAG_LEN) {
    throw new Error('Encrypted backup too small to be valid')
  }
  if (!data.subarray(0, MAGIC.length).equals(MAGIC)) {
    throw new Error('Bad magic: not a Sovereign Ecosystem encrypted backup (SEB1)')
  }
  let off = MAGIC.length
  const salt = data.subarray(off, off += SALT_LEN)
  const iv = data.subarray(off, off += IV_LEN)
  const tag = data.subarray(data.length - TAG_LEN)
  const ciphertext = data.subarray(off, data.length - TAG_LEN)

  const decipher = crypto.createDecipheriv('aes-256-gcm', deriveKey(passphrase, salt), iv)
  decipher.setAuthTag(tag)
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  writeFileSync(outPath, plaintext)
  return { bytes: plaintext.length }
}

export const ENCRYPTED_SUFFIX = '.enc'

// CLI for restore: node Council Chamber/scripts/encrypt-stream.mjs decrypt <in.zip.enc> <out.zip>
// Reads the passphrase from BACKUP_ENCRYPTION_KEY (.env on a live machine) or
// the BACKUP_ENCRYPTION_KEY the operator exports from the password manager when
// restoring on a fresh machine.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('encrypt-stream.mjs')) {
  const [cmd, inPath, outPath] = process.argv.slice(2)
  if (cmd === 'decrypt') {
    const passphrase = process.env.BACKUP_ENCRYPTION_KEY
    if (!passphrase) {
      console.error('Set BACKUP_ENCRYPTION_KEY (from the password manager) before decrypting.')
      process.exit(1)
    }
    if (!inPath || !outPath) {
      console.error('Usage: node Council Chamber/scripts/encrypt-stream.mjs decrypt <in.zip.enc> <out.zip>')
      process.exit(1)
    }
    const { bytes } = decryptFile({ inPath, outPath, passphrase })
    console.log(`Decrypted ${bytes} bytes -> ${outPath}`)
  } else {
    console.error('Usage: node Council Chamber/scripts/encrypt-stream.mjs decrypt <in.zip.enc> <out.zip>')
    process.exit(1)
  }
}
