package com.pe2pia;

import java.util.Map;
import java.util.HashMap;
import android.util.Log;
import com.google.firebase.messaging.FirebaseMessagingService;
import android.os.Bundle;
import com.google.firebase.messaging.RemoteMessage;
import com.dieam.reactnativepushnotification.modules.RNPushNotificationHelper;

public class MyFirebaseMessagingService extends com.google.firebase.messaging.FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        // Convert RemoteMessage to Bundle
        Bundle bundle = new Bundle();
        if (remoteMessage.getData() != null) {
            for (Map.Entry<String, String> entry : remoteMessage.getData().entrySet()) {
                bundle.putString(entry.getKey(), entry.getValue());
            }
        }

        new RNPushNotificationHelper(getApplication()).sendToNotificationCentre(bundle);
    }
}
