let optGames     = 0;
let correctGames = 0;   //게임 진행 횟수 => 10판 진행 시 종료.
let rmGames      = 10;       //게임 진행 횟수 => 10판 진행 시 종료.
window.addEventListener("load", function(e){


    const btnHome = this.document.querySelector('.btn-home');
    btnHome.onclick = function(){
        
        location.href = "/memory-cards";
    }

    const btnStt = this.document.querySelector('.btn-start');
    btnStt.onclick = async function(){
        
        alert("게임시작");
        $(this).text(rmGames);       // 버튼 텍스트 숨기기
        enableGameElements();   // 게임 시작 시 카드 드래그 활성화
        btnStt.onclick = null;  // onclick 이벤트 핸들러 제거
    }

    init();
    function init(p) {
  
        var imagesData = document.getElementById('imagesData').textContent;
        var imagePaths = JSON.parse(imagesData);                                // JSON 문자열을 JavaScript 객체로 변환
        var namesData  = document.getElementById('namesData').textContent;
        var names      = JSON.parse(namesData);                                

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
        
        makeImageCards(imagePaths, p)
        makeWordCards(names);
    }

    //상단 이미지 카드 생성
    function makeImageCards(imagePaths, p){

        imagePaths.sort(function () { return Math.random() - .5 });
        for (var i = 0; i < 5; i++) {
            
            // 이미지 경로
            var imagePath = imagePaths[i];
            let parts     = imagePath.split('/');
            let filename  = parts[parts.length - 1];             // "거북이.jpg"
            let nameWithoutExtension = filename.split('.')[0];   // "거북이"
            $('<img>').attr({
                  'src': imagePath
                , 'id': 'card'   + i
                , 'alt': 'Card ' + i
            }).data('number', nameWithoutExtension).appendTo('#cardImages').draggable({
                  containment: '#content'
                , stack: '#cardImages img'
                , cursor: 'move'
                , revert:   true
                , disabled: true // 드래그 비활성화
            });
        }

        if(p == 'able'){
            
            enableGameElements();
            btnStt.innerHTML = rmGames;
        }   
    }

    // 모든 카드의 드래그 활성화
    function enableGameElements() { $('#cardImages img').draggable('enable'); }

    //하단 3개 단어 카드 영역 생성
    function makeWordCards(names){

        var words = names;
        // 랜덤으로 선택된 단어를 3번 생성
        for (var i = 0; i < 3; i++) {

            // 랜덤으로 선택된 단어
            var randomWord = getRandomWord(words);
            $('<div>' + randomWord + '</div>').data('number', randomWord).appendTo('#cardSlots').droppable({
                  accept     : '#cardImages img'
                , hoverClass : 'hovered'
                , drop       : handleCardDrop
            });

            var index = words.indexOf(randomWord);
            words.splice(index, 1);                                 // 해당 인덱스의 요소 제거
        }
    }

    // 랜덤으로 단어 반환
    function getRandomWord(arr) {
       
        if (arr.length === 0) return null;                          // 배열의 길이가 0이면 null 반환
        const randomIndex = Math.floor(Math.random() * arr.length); // 랜덤한 인덱스 선택
        return arr[randomIndex];                                    // 선택된 요소 반환
    }

    //카드를 단어 카드에 드롭했을 때
    function handleCardDrop(event, ui) {

        let slotNumber = $(this).data('number');
        let cardNumber = ui.draggable.data('number');
      
        if (slotNumber == cardNumber) {
            
            ui.draggable.addClass('correct');
            correctGames++;
        }
        
        ui.draggable.draggable('disable');
        $(this).droppable('disable');
        ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
        ui.draggable.draggable('option', 'revert', false);
        
        optGames++;
        checkGame();
    }

    function addScore(){

        let $point = $('#point');               // 제이쿼리로 요소 선택
        let score = parseInt($point.val()) + 1; // 문자열을 숫자로 변환하고 1을 더함
        $point.val(score);                      // 제이쿼리로 값 업데이트
    }

    function endGames(){
           
        $('#successMessage').show();
        $('#successMessage').animate({
            left: '380px',
            top: '200px',
            width: '400px',
            height: '100px',
            opacity: 1
        });
    }

    function checkGame(){

        if(optGames == 3){
            
            rmGames--;
            if(rmGames == 0){
                alert("게임종료");
                endGames();
            }else{

                optGames     = 0;                       //초기화
                if(correctGames == 3){
                    btnStt.innerHTML = "O";
                    addScore();
                }else
                    btnStt.innerHTML = "X";
            
                correctGames = 0;    
                setTimeout(function() {
                    
                    init('able');
                }, 1000);                           // 1000밀리초 (1초) 후에 실행
            } 
        }
    }
});