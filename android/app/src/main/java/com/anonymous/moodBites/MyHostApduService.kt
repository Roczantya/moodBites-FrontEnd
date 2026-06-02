package com.anonymous.moodBites

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log

class MyHostApduService : HostApduService() {

    companion object {
        // Payload dari frontend (diset melalui HCEModule)
        var currentPayload: String = ""
    }

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        if (commandApdu == null) return hexStringToByteArray("6F00")

        // Konversi command ke Hex String untuk pengecekan
        val commandHex = commandApdu.joinToString("") { "%02X".format(it) }
        Log.d("HCE_DEBUG", "Terima APDU: $commandHex")

        /**
         * Logika: Jika reader mengirim SELECT AID (00A40400 + panjang AID + AID)
         * Contoh untuk AID F0010203040506, commandnya: 00A4040007F0010203040506
         */
        if (commandHex.startsWith("00A40400")) {
            Log.d("HCE_DEBUG", "SELECT AID MATCH. Mengirim data: $currentPayload")

            return if (currentPayload.isNotEmpty()) {
                // Ambil bytes dari string payload
                val payloadBytes = currentPayload.toByteArray(Charsets.UTF_8)
                // Tambahkan 9000 (Status Success) di akhir payload
                payloadBytes + hexStringToByteArray("9000")
            } else {
                // Jika payload kosong, kirim status Success saja
                hexStringToByteArray("9000")
            }
        }

        // Jika perintah tidak dikenal
        Log.w("HCE_DEBUG", "Perintah tidak dikenal: $commandHex")
        return hexStringToByteArray("6A81") 
    }

    override fun onDeactivated(reason: Int) {
        Log.d("HCE_DEBUG", "Koneksi NFC terputus, alasan: $reason")
    }

    // Helper untuk konversi String Hex ke ByteArray
    private fun hexStringToByteArray(s: String): ByteArray {
        val len = s.length
        val data = ByteArray(len / 2)
        for (i in 0 until len step 2) {
            data[i / 2] = ((Character.digit(s[i], 16) shl 4) + Character.digit(s[i + 1], 16)).toByte()
        }
        return data
    }
}