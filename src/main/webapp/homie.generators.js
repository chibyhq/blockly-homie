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
//    if (block.arguments_.indexOf(varName) == -1) {
      globals.push(Blockly.Python.variableDB_.getName(varName,
          Blockly.Variables.NAME_TYPE));
//    }
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

//Blockly.Python['actor_position'] = function(block) {
//  var variable_actor = Blockly.Python.variableDB_.getName(block.getFieldValue('ACTOR'), Blockly.Variables.NAME_TYPE);
//  var value_posx = Blockly.Python.valueToCode(block, 'POSX', Blockly.Python.ORDER_ATOMIC);
//  var value_posy = Blockly.Python.valueToCode(block, 'POSY', Blockly.Python.ORDER_ATOMIC);
//  var code = variable_actor+'.pos = '+value_posx+','+value_posy+'\n';
//  return code;
//};
//Blockly.Python['actor_position_tuple'] = function(block) {
//  var variable_actor = Blockly.Python.variableDB_.getName(block.getFieldValue('ACTOR'), Blockly.Variables.NAME_TYPE);
//  var value_pos = Blockly.Python.valueToCode(block, 'POS', Blockly.Python.ORDER_ATOMIC);
//  var code = variable_actor+'.pos = '+value_pos+'\n';
//  return code;
//};
//
//
//Blockly.Python['screen_size'] = function(block) {
//  var w= block.getFieldValue('W');
//  var h= block.getFieldValue('H');
//  return "WIDTH="+w+"\nHEIGHT="+h+"\n";
//};
//
//Blockly.Python['screen_clear'] = function(block) {
//  var code = 'screen.clear()\n';
//  return code;
//};
//
//Blockly.Python['screen_blit'] = function(block) {
//  var value_image = Blockly.Python.valueToCode(block, 'IMAGE', Blockly.Python.ORDER_ATOMIC);
//  var number_top = Blockly.Python.valueToCode(block, 'TOP', Blockly.Python.ORDER_ATOMIC);
//  var number_left =Blockly.Python.valueToCode(block, 'LEFT', Blockly.Python.ORDER_ATOMIC);
//  var code = 'screen.blit('+value_image+',('+number_top+','+number_left+'))\n';
//  return code;
//};
//
//Blockly.Python['screen_fill'] = function(block) {
//  var color_rgb = hexToRgb(block.getFieldValue('COLOR'));
//  var code = 'screen.fill(('+color_rgb+'))\n';
//  return code;
//};
//
//Blockly.Python['screen_create_rect'] = function(block) {
//  var value_x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC);
//  var value_y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC);
//  var value_width = Blockly.Python.valueToCode(block, 'WIDTH', Blockly.Python.ORDER_ATOMIC);
//  var value_height = Blockly.Python.valueToCode(block, 'HEIGHT', Blockly.Python.ORDER_ATOMIC);
//  var code = 'Rect(('+value_x+','+value_y+'),('+value_width+','+value_height+'))';
//  return [code, Blockly.Python.ORDER_ADDITION];
//};
//
//Blockly.Python['screen_draw_line'] = function(block) {
//  var color_rgb = hexToRgb(block.getFieldValue('COLOR'));
//  var startx = Blockly.Python.valueToCode(block, 'STARTX', Blockly.Python.ORDER_ATOMIC);
//  var starty = Blockly.Python.valueToCode(block, 'STARTY', Blockly.Python.ORDER_ATOMIC);
//  var finishx = Blockly.Python.valueToCode(block, 'FINISHX', Blockly.Python.ORDER_ATOMIC);
//  var finishy = Blockly.Python.valueToCode(block, 'FINISHY', Blockly.Python.ORDER_ATOMIC);
//  
//  var code = 'screen.draw.line(('+startx+','+starty+'),('+finishx+','+finishy+'),('+color_rgb+'))\n';
//  return code;
//};
//
//Blockly.Python['screen_draw_circle'] = function(block) {
//  var emptyOrFilled =  block.getFieldValue('EMPTYFILLED');
//  var color_rgb = hexToRgb(block.getFieldValue('COLOR'));
//  var x = Blockly.Python.valueToCode(block, 'CENTERX', Blockly.Python.ORDER_ATOMIC);
//  var y = Blockly.Python.valueToCode(block, 'CENTERY', Blockly.Python.ORDER_ATOMIC);
//  
//  var code = 'screen.draw.'+emptyOrFilled+'(('+x+','+y+'),('+color_rgb+'))\n';
//  return code;
//};
//
//Blockly.Python['screen_draw_rectangle'] = function(block) {
//  var emptyOrFilled =  block.getFieldValue('EMPTYFILLED');
//  var color_rgb = hexToRgb(block.getFieldValue('COLOR'));
//  var rect = Blockly.Python.valueToCode(block, 'RECT', Blockly.Python.ORDER_ATOMIC);
//  
//  var code = 'screen.draw.'+emptyOrFilled+'('+rect+',('+color_rgb+'))\n';
//  return code;
//};
//
//Blockly.Python['screen_draw_text'] = function(block) {
//  var text =  Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_ATOMIC);
//  var formatArray = Blockly.Python.statementToCode(block,'FORMAT');
//  var arrayDict = "";
//  // Convert text format array into a python dictionary that we unpack to
//  // fill named arguments
//  if(formatArray != null && formatArray.length > 0){
//      arrayDict = ",**{"+(formatArray.replace(/\,\s*$/, '  '))+"}";
//  }
//  
//  var code = 'screen.draw.text('+text+arrayDict+')\n';
//  return code;
//};
//
//Blockly.Python['format_font_name'] = function(block) {
//  var value =  Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
//  var code = "'fontname':"+value+",";
//  return code;
//};
//
//Blockly.Python['format_font_size'] = function(block) {
//  var value =  Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
//  var code = "'fontsize':"+value+",";
//  return code;
//};
//Blockly.Python['format_font_color'] = function(block) {
//  var value =  hexToRgb( block.getFieldValue('VALUE'));
//  var code = "'color':("+value+"),";
//  return code;
//};
//Blockly.Python['format_font_bgcolor'] = function(block) {
//  var value =  hexToRgb(block.getFieldValue('VALUE'));
//  var code = "'background':("+value+"),";
//  return code;
//};
//
//Blockly.Python['format_text_position'] = function(block) {
//  var value_anchor = block.getFieldValue('ANCHOR');
//  var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC);
//  var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC);
//  var code = "'"+value_anchor+"':("+x+','+y+"),";
//  return code;
//};
//
//Blockly.Python['format_text_rotation'] = function(block) {
//  var value_angle = block.getFieldValue('VALUE');
//  var code = "'angle':"+value_angle+",";
//  return code;
//};
//
//Blockly.Python['format_text_align'] = function(block) {
//  var value =  block.getFieldValue('VALUE');
//  var code = "'align':"+value+",";
//  return code;
//};
//
//Blockly.Python['format_text_shadow'] = function(block) {
//  var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC);
//  var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC);
//  var code = "'shadow':("+x+','+y+"),";
//  return code;
//};
//
//Blockly.Python['clock_schedule'] = function(block) {
//  var statements = Blockly.Python.statementToCode(block, 'STATEMENTS');
//  var repeatMode =  block.getFieldValue('REPEAT');
//  var callbackName = Blockly.Python.valueToCode(block, 'CALLBACK_NAME', Blockly.Python.ORDER_ATOMIC);
//  
//  if( (! callbackName) || (callbackName.trim() == "") ){
//    callbackName = Blockly.Python.variableDB_.getDistinctName('scheduled','PROCEDURE');
//  }
//  
//  var globals = getGlobalVariablesStatement(block,false);
//  var functionName = Blockly.Python.provideFunction_(
//    callbackName,
//    [ 'def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '():',
//      globals, 
//      statements,
//      '\n']);
//  var delay = Blockly.Python.valueToCode(block, 'DELAY', Blockly.Python.ORDER_ATOMIC);
//  
//  var code = 'clock.'+repeatMode+'('+functionName+','+delay+')\n';
//  return code;  
//};
//
//Blockly.Python['clock_schedule_interval'] = function(block) {
//  var statements = Blockly.Python.statementToCode(block, 'STATEMENTS');
//  var callbackName = Blockly.Python.valueToCode(block, 'CALLBACK_NAME', Blockly.Python.ORDER_ATOMIC);
//  
//  if( (! callbackName) || (callbackName.trim() == "") ){
//    callbackName = Blockly.Python.variableDB_.getDistinctName('scheduled','PROCEDURE');
//  }
//  
//  var globals = getGlobalVariablesStatement(block,false);
//  var functionName = Blockly.Python.provideFunction_(
//    callbackName,
//    [ 'def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '():',
//      globals,
//      statements,
//      '\n']);
//  var interval = Blockly.Python.valueToCode(block, 'INTERVAL', Blockly.Python.ORDER_ATOMIC);
//  
//  var code = 'clock.schedule_interval('+functionName+','+interval+')\n';
//  return code;  
//};
//
//Blockly.Python['clock_unschedule'] = function(block) {
//  var callbackName = Blockly.Python.valueToCode(block, 'CALLBACK_NAME', Blockly.Python.ORDER_ATOMIC);
//  
//  var functionName = Blockly.Python.functionNames_[callbackName];
//  var code = 'clock.unschedule('+functionName+')\n';
//  return code;  
//};

