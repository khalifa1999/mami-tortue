// Decode the ElevenLabs error message from the hex data
const hexData = "7b2264657461696c223a227061796d656e745f72657175697265642c20706c65617365207570677261646520746f207061696420706c616e2e222c22737461747573223a224572726f72222c22636f6465223a227061796d656e745f7265717569726564227d";

// Convert hex to string
let str = '';
for (let i = 0; i < hexData.length; i += 2) {
  str += String.fromCharCode(parseInt(hexData.substr(i, 2), 16));
}

console.log('Decoded ElevenLabs error:', str);
// Expected output: {"detail":"payment required, please upgrade to paid plan","status":"Error","code":"payment_required"}