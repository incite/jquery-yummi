describe 'jquery.yummi'  
  before_each
    field = $(fixture('input'))
    field.appendTo('body').show();
  end
  
  after_each
    field.hide()
  end
  
  describe 'String.prototype.substrUntil'
    it 'should return juice if it receives 4 and a whitespace as arguments'
      string = "bluejuice rocks"
      string.substrUntil(4, ' ').should.be 'juice'
    end
  end
  
  describe '$.fn.setCursorPosition'
    it 'should set the caret position to 2 when 2 is passed as an argument'
      field.val('testing')
      field.setCursorPosition(2)
      field.caretPos().should.be 2
    end  
  end
  
  describe '$.fn.wordAtCaret'
    it 'should be "foo" when the caret is over this word'
      field.val('foo bar nice');
      field.setCursorPosition(2);
      field.wordAtCaret().should.be 'foo'
    end
  end
end