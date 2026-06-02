package com.anonymous.moodBites

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log

class MyHostApduService : HostApduService() {

    companion object {
        var currentPayload: String = ""
    }

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        if (commandApdu == null) return hexStringToByteArray("6F00")

        val commandHex = commandApdu.joinToString("") { "%02X".format(it) }
        
        if (commandHex.startsWith("00A40400")) {
            // 1. Coba ambil dari variable static
            var payload = MyHostApduService.currentPayload
            
            // 2. Jika kosong, coba ambil dari SharedPreferences
            if (payload.isEmpty()) {
                val prefs = getSharedPreferences("HCE_PREFS", android.content.Context.MODE_PRIVATE)
                payload = prefs.getString("payload", "") ?: ""
            }

            Log.d("HCE_DEBUG", "MATCHED! Mengirim Payload: $payload")

            return if (payload.isNotEmpty()) {
                val payloadBytes = payload.toByteArray(Charsets.UTF_8)
                payloadBytes + hexStringToByteArray("9000")
            } else {
                Log.w("HCE_DEBUG", "Payload benar-benar kosong di storage!")
                hexStringToByteArray("9000")
            }
        }
        return hexStringToByteArray("6A81")
    }

    override fun onDeactivated(reason: Int) {
        Log.d("HCE_DEBUG", "HCE STOPPED. REASON: $reason")
    }

    private fun hexStringToByteArray(s: String): ByteArray {
        val len = s.length
        val data = ByteArray(len / 2)
        for (i in 0 until len step 2) {
            data[i / 2] = ((Character.digit(s[i], 16) shl 4) + Character.digit(s[i + 1], 16)).toByte()
        }
        return data
    }
}