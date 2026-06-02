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
        
        // Log ini akan muncul di Logcat dengan tag HCE_DEBUG
        Log.d("HCE_DEBUG", "RECEIVED: $commandHex")

        // 00A40400 adalah instruksi SELECT AID
        if (commandHex.startsWith("00A40400")) {
            Log.d("HCE_DEBUG", "MATCHED! SENDING: $currentPayload")

            return if (currentPayload.isNotEmpty()) {
                val payloadBytes = currentPayload.toByteArray(Charsets.UTF_8)
                // Kirim Payload + 9000 (Status OK)
                payloadBytes + hexStringToByteArray("9000")
            } else {
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