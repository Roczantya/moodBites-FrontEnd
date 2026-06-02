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

                return hexStringToByteArray(
                    STATUS_FAILED
                )
            }

            // Convert APDU ke HEX string
            val commandHex =
                commandApdu.joinToString("") {

                    String.format("%02X", it)
                }

            println(
                "APDU COMMAND: $commandHex"
            )

            /**
             * SELECT AID
             *
             * Biasanya command pertama dari PN532
             */
            if (
                commandHex.startsWith(
                    "00A40400"
                )
            ) {

                println("SELECT AID SUCCESS")

                return hexStringToByteArray(
                    STATUS_SUCCESS
                )
            }

            /**
             * GET DATA COMMAND
             *
             * Custom command dari PN532
             */
            if (commandHex == "80CA0000") {

                println(
                    "SEND PAYLOAD: $currentPayload"
                )

                val payloadBytes =
                    currentPayload.toByteArray(
                        Charsets.UTF_8
                    )

                val successBytes =
                    hexStringToByteArray(
                        STATUS_SUCCESS
                    )

                return payloadBytes + successBytes
            }

            /**
             * Unknown command
             */
            println("UNKNOWN APDU COMMAND")

            hexStringToByteArray(
                STATUS_UNKNOWN
            )

        } catch (e: Exception) {

            println(
                "APDU ERROR: ${e.message}"
            )

            hexStringToByteArray(
                STATUS_FAILED
            )
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