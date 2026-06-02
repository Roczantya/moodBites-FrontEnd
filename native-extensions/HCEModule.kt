package com.anonymous.moodBites

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class HCEModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    // Memberikan anotasi override nama secara eksplisit dan aman
    override fun getName(): String {
        return "HCEModule"
    }

    @ReactMethod
    fun startHCE(payload: String) {
        android.util.Log.d("HCEModule", "Menyimpan Payload: $payload")
        
        val prefs = reactApplicationContext.getSharedPreferences("HCE_PREFS", android.content.Context.MODE_PRIVATE)
        prefs.edit().putString("payload", payload).apply()
        
        MyHostApduService.currentPayload = payload
    }

    @ReactMethod
    fun stopHCE() {
        android.util.Log.d("HCEModule", "stopHCE dipanggil")
        MyHostApduService.currentPayload = ""
    }
}