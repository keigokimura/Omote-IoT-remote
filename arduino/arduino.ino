#include <Web3.h>
#include <WiFi.h> //Wifi library
#include <Contract.h>
#include <time.h>
#include "esp_wpa2.h" //wpa2 library for connections to Enterprise networks
#define EAP_IDENTITY "KBD01P0Q@tsukuba.f.eduroam.jp" //if connecting from another corporation, use identity@organisation.domain in Eduroam 
#define EAP_PASSWORD "4Y6Tm![QUWCF" //your Eduroam password
//芳賀シンヤのINFURAの情報
#define INFURA_HOST "rinkeby.infura.io"
#define INFURA_PATH  "/v3/672082360bbc4bb0a584be860d9e1f85"
#define MY_ADDRESS "0x61666605cE04f4D5e845165692D8a71C026d9a34"
#define CONTRACT_ADDRESS "0xb44cb12b9e17e6c941936331f166796cc5f44325"
#define ETHERSCAN_TX "https://rinkeby.etherscan.io/tx/"
//________________
const char* ssid = "eduroam"; // Eduroam SSID
//________________
const char* host = "arduino.php5.sk"; //external server domain for HTTP connection after authentification

int counter = 0;

//芳賀シンヤの秘密鍵
const char *PRIVATE_KEY = "2D3E4CC5AC1A653FF47A97922B6ED91BC8E42428CF5FE5637506FB20F8635DEA";

Web3 web3(INFURA_HOST, INFURA_PATH);

void ConnectWiFi();
void set_used_water();
bool timer();

volatile double waterFlow;
volatile double preWaterFlow;
bool isSent = true;

void setup() {
  Serial.begin(9600);
  waterFlow = 0;
  attachInterrupt(2, pulse, RISING);  //DIGITAL Pin 2: Interrupt 0
  delay(1000);
  
  ConnectWiFi();

  configTime(9 * 3600L, 0, "ntp.nict.jp");
  
}


void loop(){
  
 if(timer()){
    Serial.print("waterFlow: ");
    Serial.print(waterFlow);
    Serial.println(" L");
    set_used_water(waterFlow);
 }
}

void ConnectWiFi(){
    Serial.println("");
    Serial.print("Connecting to network: ");
    Serial.println(ssid);
//_____________________
    WiFi.disconnect(true);  //disconnect form wifi to set new wifi connection
    WiFi.mode(WIFI_STA); //init wifi mode
    esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY)); //provide identity
    esp_wifi_sta_wpa2_ent_set_username((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY)); //provide username --> identity and username is same
    esp_wifi_sta_wpa2_ent_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD)); //provide password
    esp_wpa2_config_t config = WPA2_CONFIG_INIT_DEFAULT(); //set config settings to default
    esp_wifi_sta_wpa2_ent_enable(&config); //set config settings to enable function
    WiFi.begin(ssid); //connect to wifi
//______________________
//    WiFi.begin(ssid, passwd); //____________追加
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        counter++;
        if(counter>=120){ //after 30 seconds timeout - reset board
        ESP.restart();
        }
    }
    
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address set: "); 
    Serial.println(WiFi.localIP()); //print LAN IP
    Serial.println("");
}

void set_used_water(double _waterFlow){
  Serial.println("Sending Transaction...");
//  int nowWaterFlow = (int)_waterFlow - (int)preWaterFlow;//今月の使用量を整数で計算(L)
  int nowWaterFlow = _waterFlow * 100 - preWaterFlow * 100;//デモ用(ml)

  Contract contract(&web3,CONTRACT_ADDRESS);
  contract.SetPrivateKey(PRIVATE_KEY);
  string addr = MY_ADDRESS;
  uint32_t nonceVal = (uint32_t)web3.EthGetTransactionCount(&addr);
  unsigned long long gasPriceVal = 1000000000ULL;
  uint32_t gasLimitVal = 3000000;
  uint8_t dataStr[100];
  memset(dataStr, 0, 100);
  string toStr = CONTRACT_ADDRESS;
  string valueStr = "0x00";
  string p = contract.SetupContractData("set_used_water(uint256)", nowWaterFlow);
  string result = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &toStr, &valueStr, &p);

  if(web3.isError(&result)) {
    //エラー処理
    Serial.println("---Sending Failed---");
    Serial.println(web3.getError(&result).c_str());
    isSent = false;
    
  } else {
    preWaterFlow = _waterFlow;//水量を記録
    string transactionHash = web3.getString(&result);
    Serial.println("---Sent---");
    Serial.println("TX on Etherscan:");
    Serial.print(ETHERSCAN_TX);
    Serial.println(transactionHash.c_str());
  //pending
    Serial.print("Pending");
    string resultReceipt;
    while(true) {
      resultReceipt = web3.getTransactionReceipt(&transactionHash);
      if(!web3.isNull(&resultReceipt)) {
        Serial.println("");
        if(!web3.getReceiptStatus(&resultReceipt)) {
          //エラー処理
          Serial.println("---Fail---");
          isSent = false;
       
        } else {
          Serial.println("---Success---");
          preWaterFlow = _waterFlow;
          isSent = true;
        }
        break;
      }
      Serial.print(".");
    }
  }
  Serial.println("");
  Serial.println("");
}


//10秒前が同じ月かどうか判断する=>月が変わった時に
bool timer(){
//  // 曜日文字列配列
//  static const char *pszWDay[] = {"Sun","Mon","Tue","Wed","Thu","Fri","Sat"};
//
//  // 現在時刻の取得
//  time_t timeNow = time(NULL);
//  struct tm* tmNow = localtime(&timeNow);
//
//  
//  char past_Date[32];
//  char present_Date[32];
//  sprintf(present_Date, "%04d/%02d",
//          tmNow->tm_year+1900,
//          tmNow->tm_mon+1);
//
//
//  // 時刻
//  char szTime1[32];
//  char szTime2[32];
//  sprintf( szTime1, "%02d:%02d",
//          tmNow->tm_hour,
//          tmNow->tm_min
//          );
//
//  char *s1 = past_Date;
//  char *s2 = present_Date;
//
//  if(strcmp(s1,s2) == 0){
//      return true;
//    }else{
//      return false;
//    }
//    
//  past_Date[32] = present_Date[32];
//  delay(10000);
  
//デモ用_______________
  int second = 120;//水量を計る時間の設定
  Serial.println("Measuring");
  for (int i=0; i<second; i++){
    Serial.print(".");
    delay(1000);
   }
  Serial.println("");
  return true;
//____________________
  
}

void pulse()   //measure the quantity of square wave
{
  waterFlow += 1.0 / 450.0;
}
