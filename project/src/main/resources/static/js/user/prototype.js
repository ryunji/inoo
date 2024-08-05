window.onload = () => {
  
    $(init);
};

var correctCards = 0;

function init() {
  
    var imagesData = document.getElementById('imagesData').textContent;
    var imagePaths = JSON.parse(imagesData);                                // JSON 문자열을 JavaScript 객체로 변환
    var namesData = document.getElementById('namesData').textContent;
    var names = JSON.parse(namesData);                                

    $('#successMessage').hide();
    $('#successMessage').css({
        left: '580px',
        top: '250px',
        width: 0,
        height: 0
    });

  correctCards = 0;
  $('#cardImages').html('');
  $('#cardSlots').html('');

  var numbers = imagePaths;//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  numbers.sort(function () { return Math.random() - .5 });

  for (var i = 0; i < 5; i++) {
      // 이미지 경로
    var imagePath = numbers[i];
    let parts = imagePath.split('/');
    let filename = parts[parts.length - 1]; // "거북이.jpg"
    let nameWithoutExtension = filename.split('.')[0]; // "거북이"
    $('<img>').attr({
        'src': imagePath,
        'id': 'card' + i,
        'alt': 'Card ' + i
    }).data('number', nameWithoutExtension).appendTo('#cardImages').draggable({
        containment: '#content',
        stack: '#cardImages img',
        cursor: 'move',
        revert: true
    });
  }

  var words = names;
    // 랜덤으로 선택된 단어
    var randomWord = getRandomWord(words);
    $('<div>' + randomWord + '</div>').data('number', randomWord).appendTo('#cardSlots').droppable({
        accept: '#cardImages img',
        hoverClass: 'hovered',
        drop: handleCardDrop
    });
}

function getRandomWord(arr) {
    // 배열의 길이가 0이면 null 반환
    if (arr.length === 0) {
        return null;
    }
    // 랜덤한 인덱스 선택
    var randomIndex = Math.floor(Math.random() * arr.length);
    // 선택된 요소 반환
    return arr[randomIndex];
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

      let text = document.getElementById("cor");
      if (text) {
          text.innerHTML = "맞았습니다";
          // 점수 업데이트
        let $point = $('#point'); // 제이쿼리로 요소 선택
        let score = parseInt($point.val()) + 1; // 문자열을 숫자로 변환하고 1을 더함
        $point.val(score); // 제이쿼리로 값 업데이트

      } else {
          console.error("ID가 'cor'인 요소를 찾을 수 없습니다.");
      }
  }

  if (slotNumber != cardNumber) {
      let text = document.getElementById("cor");
      if (text) {
          text.innerHTML = "틀렸습니다.";
      } else {
          console.error("ID가 'cor'인 요소를 찾을 수 없습니다.");
      }
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