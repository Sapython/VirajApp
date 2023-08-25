package com.shreeva.shreeva;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import java.io.File;
import java.io.IOException;

public class MainActivity extends BridgeActivity {

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  void openFile(String filePath) throws IOException {
    var fileOpener = new FileOpen();
    File myFile = new File(filePath);
    fileOpener.openFile(this,myFile);
  }
}
