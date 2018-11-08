function getGlobalVariablesStatement(block, addLineReturn) {
  if(addLineReturn=== undefined) {
    addLineReturn = true;
  }
  // taken from blockly/blob/master/generators/python/procedures.js
  var globals = [];
  var workspace = block.workspace;
  var varName;
  var variables = workspace.getAllVariables() || [];
  for (var i = 0, variable; variable = variables[i]; i++) {
    varName = variable.name;
    globals.push(Blockly.Python.variableDB_.getName(varName,
          Blockly.Variables.NAME_TYPE));
  }
  var globals = globals.length ? '  global ' + globals.join(', ') + (addLineReturn?'\n':'') : '';
  return globals;
}

// We assume an MQTT client variable is already declared in the global context
// and a connection listener is registered to handle connection confirmations

Blockly.Python['mqtt_connect'] = function(block) {
  Blockly.Python.definitions_['import paho.mqtt.client as mqtt']= "import paho.mqtt.client as mqtt";
  Blockly.Python.definitions_['def paho mqtt_client']= "mqtt_client = mqtt.Client()";
  Blockly.Python.definitions_['def mqtt_connected']= "def mqtt_connected(client, userdata, flags, rc):\n"
	    +"  global mqtt_client\n"
	    +"  mqtt_client.subscribe('#',0)\n";
  Blockly.Python.definitions_['def paho mqtt_client_on_connect']= "mqtt_client.on_connect = mqtt_connected";
  
  var code = 'mqtt_client.connect_async("192.168.12.100", 1883)\n'
	       +'mqtt_client.loop_start()\n';
  
  return code;
};

Blockly.Python['mqtt_on_message'] = function(block) {
  Blockly.Python.definitions_['import paho.mqtt.subscribe']= "import paho.mqtt.subscribe as mqtt_subscribe";
  var statements = Blockly.Python.statementToCode(block, 'STATEMENTS');
  var callbackName = block.getFieldValue('CALLBACK_NAME');
  
  if( (! callbackName) || (callbackName.trim() == "") ){
    callbackName = Blockly.Python.variableDB_.getDistinctName('mqtt_callback','PROCEDURE');
  }
  
  var globals = getGlobalVariablesStatement(block,false);
  var functionName = Blockly.Python.provideFunction_(
    callbackName,
    [ 'def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(client,userdata,message):',
      globals, 
      statements,
      '\n']);
  var topic = block.getFieldValue('TOPIC');
  if( (! topic) || (topic.trim() == "") ){
	  topic = "";
  }
  var code = 'mqtt_client.message_callback_add("'+topic+'",'+functionName+')\n';
  return code;  

};



Blockly.Python['mqtt_message_payload'] = function(block) {
    var code = 'message.payload.decode("utf-8")';
    return [code, Blockly.Python.ORDER_ADDITION];
};

Blockly.Python['mqtt_message_topic'] = function(block) {
    var code = 'message.topic.decode("utf-8")';
    return [code, Blockly.Python.ORDER_ADDITION];
};

Blockly.Python['homie_get_device'] = function(block) {
  var code = 'message.topic.decode("utf-8").split("/")[1]';
  return [code, Blockly.Python.ORDER_ADDITION];
};
//Blockly.Python['homie_get_node'] = function(block) {
//  var code = 'message.topic.split("/")[2]';
//  return [code, Blockly.Python.ORDER_ADDITION];
//};
//
Blockly.Python['homie_get_property'] = function(block) {
  var code = 'message.topic.decode("utf-8").split("/")[3]';
  return [code, Blockly.Python.ORDER_ADDITION];
};

