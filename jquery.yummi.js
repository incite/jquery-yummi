(function($) {
  String.prototype.substrUntil = function(index, until, backwards) {
    var string = [];
    var regex = new RegExp(until, 'ig');
    if (backwards) index--; // reverse the caret direction, pretty much
    while(this[index]) {
      if (regex.test(this[index])) break;
      if (backwards) {
        string.unshift(this[index]);
        index--;
      } else {
        string.push(this[index]);
        index++;
      }
    }
    return string.join('');
  }
  
  $.fn.caretPos = function(element) {
    // http://www.webdeveloper.com/forum/showthread.php?t=74982
    // and many, many other references
    var pos;
    if (document.selection) {
      var sel = document.selection.createRange();
      sel.moveStart('character', this.get(0).value.length);
      pos = sel.text.length;
    } else {
      pos = this.get(0).selectionStart;
    }
    return pos;
  }
  
  $.wordAtCaret = function(element) {
    var value = $(element).val();
    var index = $(element).caretPos();
    var forward = value.substrUntil(index, ' ');
    var backward = value.substrUntil(index, ' ', true);
    return backward + forward;
  }
  $.fn.wordAtCaret = function() { return $.wordAtCaret(this.get(0)) }
  
  $.fn.setCursorPosition = function(pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
  
  $.yummi = function(element, options) {
    var element = $(element);
    var results, timeout;
    var defaults = {collection: ['the', 'fbi', 'is', 'after', 'you']};
    var options = $.extend(defaults, options);
    
    // Private
    var KEY = { 
      UP: 38, 
      DOWN: 40, 
      TAB: 9,
      RETURN: 13, 
      ESC: 27, 
    };  
    
    function keyDownHandler(event) {
      switch(event.keyCode) {
        case KEY.UP:
          event.preventDefault();
          stepUp();
          break;
        case KEY.DOWN:
          event.preventDefault();
          stepDown();
          break;
        case KEY.TAB:
          if (element.val() == "") break;
        case KEY.RETURN:
          event.preventDefault();
          if (element.val() == "") element.parents('form').trigger('submit');
          if (focused().length) {
            add(focused().text());
            hideResults();
            clearFocus()
          }
          return false;
        case KEY.ESC:
          hideResults();
          clearFocus();
          break;
        default:
          showResults()
          clearTimeout(timeout);
          timeout = setTimeout(function() { suggestFor(element.wordAtCaret()) }, 100);
          break;
      }
    }
    
    function suggestFor(text) {
      if (results.find('.result').length) results.find('.result').remove();
      var regex = new RegExp('^' + text, 'ig');
      var relevant = $.grep(options.collection, function(entry) { return regex.test(entry) })
      if (relevant.length) { // results found
        if (results.find('.result').length) results.find('.result').remove();
        $.each(relevant, function(index, result) {
          results.append('<div class="result">' + result + '</div>');
        })
      } else {
      }
      console.log(relevant)
      // $.each(relevant, function(index, result) {
      //   console.log(result);
      // })
    }
    
    function showResults() {
      if (!focused().length) setFocus(results.find('.result:first'));
      results.show() 
    }
    function hideResults() { results.hide() }
    function clearFocus() { results.find('.focused').removeClass('focused') }
    function focused() { return results.find('.focused') }
    
    function setFocus(result) { 
      if (focused().length) clearFocus();
      $(result).addClass('focused')
    }
    
    function stepUp() {      
      if (!focused().prev().length) return false;
      setFocus(focused().prev('.result'))
    }
    
    function stepDown() {
      if (!focused().length) {
        setFocus(results.find('.result:first'))
      } else if (!focused().next().length) {
        return false
      } else {
        setFocus(focused().next())
      }
    }
    
    function add(result) {
      var value = element.val();
      var position = getCaretWordIndex();
      value = value.substr(0, position) + result + value.substr(position + element.wordAtCaret().length);
      element.val(value);
      element.setCursorPosition(value.length);
      // var caret      
    }
    
    function getCaretWordIndex() {    
      return element.caretPos() - element.val().substrUntil(element.caretPos(), ' ', true).length;
    }

    function insertACResultsList() {
      element.before('<div class="yummi-results"><div class="result">omg</div><div class="result">omg2</div></div>');
      results = element.parents().find('.yummi-results');
      var marginTop = element.height() 
        + element.padding().top 
        + element.padding().bottom  
        + element.border().top
        + element.border().bottom;
      results.margin({top: marginTop - 1}) // -1 so it appears slightly attached to the text field
    }
    
    $.extend($.yummi, { getca: function() { return getCaretWordIndex() }, add: function(result) { return add(result) }})
    
    element.keydown(keyDownHandler);
    element.blur(function() { hideResults(); clearFocus() });
    insertACResultsList();
    element.attr('autocomplete', 'off');    
  }
    
  $.fn.yummi = function(options) { return this.each(function() { $.yummi(this, options) }) }
  
})(jQuery);

// function getCaretWordIndex() {    
//   var element = $(':text:first');
//   var value = element.val();
//   return value.substrUntil(element.caretPos, ' ', true).length;
//   // return value.substrUntil(((element.caretPos == value.length) ? element.caretPos - 1 : element.caretPos), ' ', true).length;
// }
