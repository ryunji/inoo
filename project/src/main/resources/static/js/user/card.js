window.onload = () => {
    $(init);
  };
  
  var correctCards = 0;
  
  function init() {
    $('#successMessage').hide();
    $('#successMessage').css({
      left: '580px',
      top: '250px',
      width: 0,
      height: 0
    });
  
    correctCards = 0;
    $('#cardPile').html('');
    $('#cardSlots').html('');
  
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    numbers.sort(function () { return Math.random() - .5 });
  
    for (var i = 0; i < 10; i++) {
      $('<div>' + numbers[i] + '</div>').data('number', numbers[i]).attr('id', 'card' + numbers[i]).appendTo('#cardPile').draggable({
        containment: '#content',
        stack: '#cardPile div',
        cursor: 'move',
        revert: true
      });
    }
  
    var words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    for (var i = 1; i <= 10; i++) {
      $('<div>' + words[i - 1] + '</div>').data('number', i).appendTo('#cardSlots').droppable({
        accept: '#cardPile div',
        hoverClass: 'hovered',
        drop: handleCardDrop
      });
    }
  }
  
  function handleCardDrop(event, ui) {
    var slotNumber = $(this).data('number');
    var cardNumber = ui.draggable.data('number');
  
    if (slotNumber == cardNumber) {
      ui.draggable.addClass('correct');
      ui.draggable.draggable('disable');
      $(this).droppable('disable');
      ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
      ui.draggable.draggable('option', 'revert', false);
      correctCards++;
    }
  
    if (correctCards == 10) {
      $('#successMessage').show();
      $('#successMessage').animate({
        left: '380px',
        top: '200px',
        width: '400px',
        height: '100px',
        opacity: 1
      });
    }
  
  }