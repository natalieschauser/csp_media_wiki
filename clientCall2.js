function callWithArguments(fxn, this_object, args) {
    fxn.apply(this_object, args);
/*
  if ( args.length == 0 ) {
    fxn();
  } else if ( args.length == 1 ) {
    fxn(args[0]);
  } else if ( args.length == 2 ) {
    fxn(args[0], args[1]);
  } else if ( args.length == 3 ) {
    fxn(args[0], args[1], args[2]);
  } else if ( args.length == 4 ) {
    fxn(args[0], args[1], args[2], args[3]);
  } else if ( args.length == 5 ) {
    fxn(args[0], args[1], args[2], args[3], args[4]);
  } else if ( args.length == 6 ) {
    fxn(args[0], args[1], args[2], args[3], args[4], args[5]);
  } else {
    alert('undefined number of arguments, ' + args.length);
  }*/
}

function clientCall(fxn, args) {
    //alert("I am calling: " + fxn);
    //alert("I have " + mw.toolbar);
    
    //alert("I also have " + mw.toolbar.addButton);
    var fxns = {
        'mw.config.set' : function(fargs) { callWithArguments(mw.config.set, mw.config, fargs); },
        'mw.loader.load' : function(fargs) { callWithArguments(mw.loader.load, mw.loader, fargs); },
        'mw.loader.register' : function(fargs) { callWithArguments(mw.loader.register, mw.loader, fargs); },
        'mw.loader.state' : function(fargs) { callWithArguments(mw.loader.state, mw.loader, fargs); },
        'mw.Map' : function(fargs) { callWithArguments(mw.Map, mw, fargs); },
        'mw.toolbar.addButton' : function(fargs) { callWithArguments(mw.toolbar.addButton, mw.toolbar, fargs); },
        'mw.user.options.set' : function(fargs) { callWithArguments(mw.user.options.set, mw.user.options, fargs); },
        'mw.user.tokens.set' : function(fargs) { callWithArguments(mw.user.tokens.set, mw.user.tokens, fargs); },
        'document.write' : function(fargs) { callWithArguments(document.write, document, fargs); },
        'ProtectionForm.init' : function(fargs) { callWithArguments(ProtectionForm.init, ProtectionForm, fargs); },
        'mw.message.set' : function(fargs) { callWithArguments(mw.message.set, mw.message, fargs); },
        'mw.loader.implement' : function(fargs) { callWithArguments(mw.loader.implement, mw.loader, fargs); }
    };  
  fxns[fxn](args);
      
}

function parseCalls(clientFxnName) {
  var fxn, num_args, args;
  var fxns = document.getElementsByName(clientFxnName);
  for ( i = 0; i < fxns.length; ++i ) {
    fxn = fxns[i];
    num_args = fxn.getAttribute('data-fxn-num-args');
    args = new Array();
    
    for ( j = 0; j < num_args; ++j ) {
      args[j] = fxn.getAttribute('data-fxn-arg' + j);
      args[j] = args[j].replace('&quot;', '"');
      if ( args[j][0] == '[' ) {
          args[j] = jQuery.parseJSON(args[j]);
      } else if ( args[j][0] == '"') {
          temp = args[j].substring(1, args[j].length - 1);
          originalLen = temp.length;
          temp = temp.replace("\\\'", "'").replace("\\n","").replace("\\x3c", "<").replace("\\x3e",">");
          newLen = temp.length;
          while (originalLen > newLen){
              originalLen = newLen;
              temp = temp.replace("\\\'", "'").replace("\\n", "").replace("\\x3c", "<").replace("\\x3e",">");
              newLen = temp.length;
          }
          args[j] = temp;
      }
      //alert(args[j]);
    }
    
    //alert('Handling ' + fxn.getAttribute('data-fxn-name') + ": " + args.join(", "));
    clientCall(fxn.getAttribute('data-fxn-name'), args);
  }
}

function parseArgument(arg) {
    if ( typeof arg == 'string' && arg[0] == '[' ) {
        //alert("Got " + arg);
        arg = arg.substring(1, arg.length - 1);
        pieces = arg.split(',');
        removedQuotes = new Array();
        for ( piece in pieces ) {
            if ( piece[0] == '"' ) {                
                removedQuotes[removedQuotes.length] = piece.substring(1, piece.length - 1);
            } else {
                removedQuotes[removedQuotes.length] = piece;
            }
        }
        return removedQuotes;
    } else {
        //alert(typeof arg);
        return arg;
    }
}

//parseCalls('clientFxnHighPriority');
// alert("hi");
// parseCalls('clientFxn');
// var t = new Date().getTime() + 5000;
// while ( new Date().getTime() < t ) {
//     ;
// }

// clientCallNumber = 0;
// 
// function doNextClientCall() {
//     var fxn, num_args, args;
//     var fxns = document.getElementsByName('clientFxn');
// 
//       fxn = fxns[clientCallNumber];
//       if ( fxn == undefined ) {
//           clearInterval(clientCallTimer);
//           return;
//       }
//       ++clientCallNumber;
//       num_args = fxn.getAttribute('data-fxn-num-args');
//       args = new Array();
// 
//       for ( j = 0; j < num_args; ++j ) {
//         args[j] = fxn.getAttribute('data-fxn-arg' + j);
//         args[j] = args[j].replace('&quot;', '"');
//         if ( args[j][0] == '[' ) {
//             args[j] = jQuery.parseJSON(args[j]);
//         } else if ( args[j][0] == '"') {
//             args[j] = args[j].substring(1, args[j].length - 1);
//         }
//         //alert(args[j]);
//       }
// 
//       // alert('Handling ' + fxn.getAttribute('data-fxn-name') + ": " + args.join(", "));
//       clientCall(fxn.getAttribute('data-fxn-name'), args);
//     
// }
// 
// 
// clientCallTimer = setInterval(doNextClientCall, 3000);
//setTimeout(function() { "parseCalls('clientFxn')" }, 10000);

parseCalls('clientFxn');
