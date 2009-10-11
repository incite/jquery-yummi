describe 'jquery.yummi'
  
  before_each
    field = $(fixture('input'))
    field.appendTo('body').show();
  end
  
  after_each
    field.hide()
  end
  
  describe '$.fn.wordAtCaret'
    it 'should be "foo" when the caret is over this word'
      field.val('foo bar nice');
      field.setCursorPosition(2);
      field.wordAtCaret().should.be 'foo'
    end
  end
  
end