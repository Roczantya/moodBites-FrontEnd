package com.anonymous.moodBites

import android.nfc.cardemulation.HostApduService
import android.os.Bundle

class MyHostApduService : HostApduService() {

    companion object {

        // Payload dari frontend
        var currentPayload: String = ""

        // Status code
        private const val STATUS_SUCCESS = "9000"
        private const val STATUS_FAILED = "6F00"
        private const val STATUS_UNKNOWN = "6D00"
    }

    override fun processCommandApdu(
    commandApdu: ByteArray?,
    extras: Bundle?
): ByteArray {

    return try {
        // Kalau APDU null
        if (commandApdu == null) {
            return hexStringToByteArray(STATUS_FAILED)
        }

        // Convert APDU ke HEX string
        val commandHex = commandApdu.joinToString("") {
            String.format("%02X", it)
        }

        println("APDU COMMAND: $commandHex")

        /**
         * 1. SELECT AID
         * Ganti "F0010203040506" dengan AID yang Anda daftarkan di apdu_service.xml
         */
        val targetAid = "A0000002471001" 
        val selectAidHeader = "00A40400"
        
        if (commandHex.startsWith(selectAidHeader) && commandHex.contains(targetAid)) {
            println("SELECT AID SUCCESS - MATCHED")
            return hexStringToByteArray(STATUS_SUCCESS)
        }

        /**
         * 2. GET DATA COMMAND
         * Menggunakan .startsWith() karena PN532 biasanya menambahkan byte 'Le' di akhir perintah 
         * (Contoh: "80CA000000")
         */
        if (commandHex.startsWith("80CA0000")) {
            println("SEND PAYLOAD: $currentPayload")

            val payloadBytes = currentPayload.toByteArray(Charsets.UTF_8)
            val successBytes = hexStringToByteArray(STATUS_SUCCESS)

            return payloadBytes + successBytes
        }

        /**
         * Unknown command
         */
        println("UNKNOWN APDU COMMAND: $commandHex")
        return hexStringToByteArray(STATUS_UNKNOWN)

    } catch (e: Exception) {
        println("APDU ERROR: ${e.message}")
        return hexStringToByteArray(STATUS_FAILED)
    }
}

    override fun onDeactivated(reason: Int) {

        println(
            "HCE DEACTIVATED: $reason"
        )
    }

    private fun hexStringToByteArray(
        data: String
    ): ByteArray {

        val len = data.length

        val result = ByteArray(len / 2)

        var i = 0

        while (i < len) {

            result[i / 2] = (
                (
                    Character.digit(
                        data[i],
                        16
                    ) shl 4
                ) + Character.digit(
                    data[i + 1],
                    16
                )
            ).toByte()

            i += 2
        }

        return result
    }
}