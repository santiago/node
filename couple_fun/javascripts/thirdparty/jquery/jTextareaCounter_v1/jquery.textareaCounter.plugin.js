/*
 * jQuery Textarea Characters Counter Plugin
 * Examples and documentation at: http://roy-jin.appspot.com/jsp/textareaCounter.jsp
 * Copyright (c) 2010 Roy Jin
 * Version: 1.0.0 (11-JUN-2010)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.4.2 or later
 */
(function($){  
	$.fn.textareaCount = function(options) {   
		var defaults = {  
			maxCharacterSize: -1,  
			textFontSize: '10px',
			textColor: '#000000',
			textFamily: 'Tahoma,sans-serif',
			textAlign: 'right',
			warningColor: '#FF0000',  
			warningNumber: 20,
			isCharacterCount: true,
			isWordCount: false
		};  
		var options = $.extend(defaults, options);
		
		var container = $(this);
		if(options.maxCharacterSize < 0){
			return;
		}
		$("<div class='charleft'>&nbsp;</div>").insertAfter(container);
		//create charleft css
		var charLeftCss = {
			'font-size' : options.textFontSize,
			'font-family' : options.textFamily,
			'color' : options.textColor,
			'text-align' : options.textAlign,
			'width' : container.width()
		};
		var charLeftInfo = getNextCharLeftInformation(container);
		charLeftInfo.css(charLeftCss);
		
		container.bind('keyup', function(event){limitTextAreaByCharacterCount();})
				 .bind('mouseover', function(event){setTimeout(function(){limitTextAreaByCharacterCount();}, 10);})
				 .bind('paste', function(event){setTimeout(function(){limitTextAreaByCharacterCount();}, 10);});
		
		function getNextCharLeftInformation(container){
				return container.next('.charleft');
		}
		
		function limitTextAreaByCharacterCount(){
			var content = container.val();
			var contentLength = content.length;
			var resultString = '';
			
			if(options.isCharacterCount){
				//If copied content is already more than maxCharacterSize, chop it to maxCharacterSize.
				if(contentLength >= options.maxCharacterSize) {
					content = content.substring(0, options.maxCharacterSize); 				
				}
				
				var count = 0;
				for(var i=0; i<contentLength;i++){
					if(content.charAt(i) == '\n'){
						count++;
					}
				}
				var systemmaxCharacterSize = 0;
				
				var strOS = navigator.appVersion;
				if (strOS.toLowerCase().indexOf('win') != -1){
					/**
					 * Count new line character.
					 * For windows, it occupies 2 characters
					 */
					 systemmaxCharacterSize = options.maxCharacterSize - count;
				}else{
					 systemmaxCharacterSize = options.maxCharacterSize
				}
				
				if(contentLength > systemmaxCharacterSize){
					//avoid scroll bar moving
					var originalScrollTopPosition = this.scrollTop;
					container.val(content.substring(0, systemmaxCharacterSize));
					this.scrollTop = originalScrollTopPosition;
				}
				
				if(systemmaxCharacterSize - contentLength <= options.warningNumber){
					charLeftInfo.css({"color" : options.warningColor});
				}else {
					charLeftInfo.css({"color" : options.textColor});
				}
				
				resultString = 'Characters: '
				if (strOS.toLowerCase().indexOf('win') != -1){
					resultString += (container.val().length + count) + "/" + options.maxCharacterSize
				}else{
					resultString += container.val().length + "/" + options.maxCharacterSize
				}
			}
			
			if(options.isWordCount){
				var word_count = countWord(getCleanedWordString(container.val()));
				resultString += ' Words: ' + word_count;
			}
			
			charLeftInfo.html(resultString);
		}
		
		function getCleanedWordString(content){
			var fullStr = content + " ";
			var initial_whitespace_rExp = /^[^A-Za-z0-9]+/gi;
			var left_trimmedStr = fullStr.replace(initial_whitespace_rExp, "");
			var non_alphanumerics_rExp = rExp = /[^A-Za-z0-9]+/gi;
			var cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ");
			var splitString = cleanedStr.split(" ");
			return splitString;
		}
		
		function countWord(cleanedWordString){
			var word_count = cleanedWordString.length-1;
			return word_count;
		}
	};  
})(jQuery); 