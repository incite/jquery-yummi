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
  
  // http://www.webdeveloper.com/forum/showthread.php?t=74982  
  $.fn.caretPos = function(element) {
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
  
  // http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
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
    var defaults = {collection: ['apple', 'carrot', 'banana', 'lemon', 'melon', 'onion', 'beetroot', 'orange']};
    var options = $.extend(defaults, options);
    element.data('yummi.collection', (options.collection || defaults.collection));
    if (element.data('yummi.active')) return false; // let the collection be updated and bail out
    
    // Private
    var KEY = { 
      UP: 38, 
      DOWN: 40,
      RIGHT: 39,
      LEFT: 37,
      TAB: 9,
      RETURN: 13,
      ESC: 27,
      SPACE: 32
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
        case KEY.TAB:
        case KEY.RIGHT:
          if (focused().length) {
            event.preventDefault();
            add(focused().text());
            hideResults();
            clearFocus();
          }
          break;
        case KEY.SPACE:
          if (autoCompleting()) {
            hideResults();
            clearFocus();
          }
          break;
        case KEY.LEFT:
          break; // do nothing
        default:
          clearTimeout(timeout);
          timeout = setTimeout(function() { suggestFor(element.wordAtCaret()) }, 100);
          break;
      }
    }
    
    function suggestFor(text) {
      if (text == '' || text == undefined) return false;
      if (results.find('> div').length) results.find('> div').remove();
      var regex = new RegExp('^' + text, 'ig');
      var matches = $.grep(element.data('yummi.collection'), function(entry) { return regex.test(entry) })
      if (matches.length) { // results found
        if (results.find('.result').length) results.find('.result').remove();
        $.each(matches, function(index, match) {
          var result = $('<div class="result">' + match + '</div>');
          result
            .mouseover(function() { setFocus(this) })
            .click(function() { add($(this).text()) });
          results.append(result);
        })
      } else {
        results.append('<div class="no_results">No matches found</div>');
      }
      showResults();
    }
    
    function showResults() {
      if (!focused().length) setFocus(results.find('.result:first'));
      results.show() 
    }
    function hideResults() { results.hide() }
    function clearFocus() { results.find('.focused').removeClass('focused') }
    function focused() { return results.find('.focused') }
    function autoCompleting() { return results.is(':visible') }
    
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
    }
    
    function getCaretWordIndex() {    
      return element.caretPos() - element.val().substrUntil(element.caretPos(), ' ', true).length;
    }

    function insertACResultsList() {
      element.before('<div class="yummi-results"></div>');
      results = element.parents().find('.yummi-results');
      var marginTop = element.height() 
        + element.padding().top 
        + element.padding().bottom  
        + element.border().top
        + element.border().bottom;
      results.margin({top: marginTop - 1}) // -1 so it appears slightly attached to the text field
    }
        
    insertACResultsList();
    element
      .keydown(keyDownHandler)
      .blur(function() { hideResults(); clearFocus() })
      .attr('autocomplete', 'off')
      .data('yummi.active', true);
  }
    
  $.fn.yummi = function(options) { return this.each(function() { $.yummi(this, options) }) }
  
})(jQuery);