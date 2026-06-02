package com.anonymous.moodBites

import com.facebook.react.bridge.*

class HCEModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {

        return "HCEModule"
    }

    @ReactMethod
    fun startHCE(payload: String) {

        MyHostApduService.currentPayload = payload
    }

    @ReactMethod
    fun stopHCE() {

        MyHostApduService.currentPayload = ""
    }
}