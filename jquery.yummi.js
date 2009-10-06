(function($) {
  $.yummi = function(element, options) {
    var element = $(element);
    var results;
    var defaults = {};
    $.extend(options, defaults);
    
    // Private
    var KEY = { 
      UP: 38, 
      DOWN: 40, 
      DEL: 46, 
      TAB: 9,
      RETURN: 13, 
      ESC: 27, 
      COMMA: 188,
      PAGEUP: 33, 
      PAGEDOWN: 34, 
      BACKSPACE: 8
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
          if (textField.val() == "") element.parents('form').trigger('submit');
          if (focused().length) {
            add(focused());
            hideResults();
            clearFocus()
          }
          return false;
        case KEY.ESC:
          hideResults();
          clearFocus();
          items.hide('slow', function() { $(this).empty() });
          break;
        default:
          showResults()
          break;
      }
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
      if (focused().prev()[0] == undefined) return false;
      setFocus(focused().prev('.result'))
    }
    
    function stepDown() {
      if (focused().next()[0] == undefined) return false;
      setFocus(focused().next('.result'))
    }
    
    function add(result) {
      
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
    
    element.keydown(keyDownHandler);
    element.blur(function() { hideResults(); clearFocus() });
    insertACResultsList();
    element.attr('autocomplete', 'off');
  }
  
  $.fn.yummi = function(options) { return this.each(function() { $.yummi(this, options) }) }
  
})(jQuery);