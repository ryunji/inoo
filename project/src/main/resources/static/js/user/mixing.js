window.addEventListener('load', function () {

    let optGames     = 0;
    let correctGames = 0;                                                       //게임 진행 횟수 => 10판 진행 시 종료.
    let rmGames      = 10;                                                      //게임 진행 횟수 => 10판 진행 시 종료.

    var imagesData = document.getElementById('imagesData').textContent;
    let orgImagePaths = JSON.parse(imagesData);
    var imagePaths = null;                                                      // JSON 문자열을 JavaScript 객체로 변환
    var namesData  = document.getElementById('namesData').textContent;
    var names      = JSON.parse(namesData);                  
    
    let remainingImagePaths  = [];                                              // 전역 변수로 선언
    let selectedCards = []; 

    const homeBtn = this.document.querySelector('.btn-home');
    homeBtn.onclick = function(){
        
       location.href = "/memory-cards";
    }

    const sttBtn = this.document.querySelector('.btn-start');
    sttBtn.onclick = async function(){
        
        alert("게임시작");
        $(this).text(rmGames);       // 버튼 텍스트 숨기기
        enableGameElements();   // 게임 시작 시 카드 드래그 활성화
        sttBtn.onclick = null;  // onclick 이벤트 핸들러 제거
    }

    let p = 'enable';

    init(p);
    function init(p){

        imagePaths = orgImagePaths.slice(); // 직접 참조하지 않고, 배열의 복사본 생성
        correctCards = 0;
        $('#cardImages').html('');
        $('#cardSlots').html('');

        // 1.상단 이미지 카드 생성.
        let selectedCardNames = makeImageCards(imagePaths, p);

        // 2. 하단에 단어 카드 생성.
        makeWordCards(selectedCardNames);
    }
    
  

    // 1.상단 이미지 카드 생성
    function makeImageCards(imagePaths, p){

        let selectedCardNames = [];                                     // 빈 배열로 초기화
        imagePaths.sort(function () { return Math.random() - .5 });
        for (var i = 0; i < 5; i++) {
            
            // 이미지 경로
            var imagePath = imagePaths[i];
            let parts     = imagePath.split('/');
            let filename  = parts[parts.length - 1];                    // "거북이.jpg"
            let nameWithoutExtension = filename.split('.')[0];          // "거북이"
            $('<img>').attr({
                  'src': imagePath
                , 'id' : 'card'  + i
                , 'alt': 'Card ' + i
            }).data('number', nameWithoutExtension).appendTo('#cardImages').draggable({
                  containment: '#content'
                , stack: '#cardImages img'
                , cursor: 'move'
                , revert:   true
                , disabled: true                                // 드래그 비활성화
            });

            selectedCards.push(imagePath);
            // 이름을 selectedCardNames 배열에 추가
            selectedCardNames.push(nameWithoutExtension);       // push 메서드 사용
            // 사용된 imagePath를 imagePaths에서 제거
            var index = imagePaths.indexOf(imagePath);
            if (index > -1) {
                imagePaths.splice(index, 1);                    // 해당 인덱스의 요소 제거
            }
        }

        remainingImagePaths = imagePaths;
        console.log("remainingImagePaths :", remainingImagePaths);

        if(p == 'able'){
            
            enableGameElements();
            sttBtn.innerHTML = rmGames;
        }   

        return selectedCardNames;
    }
    
    //하단 3개 단어 카드 영역 생성
    function makeWordCards(names){

        var words = names;
        // 랜덤으로 선택된 단어를 3번 생성
        for (var i = 0; i < 3; i++) {

            // 랜덤으로 선택된 단어
            var randomWord = getRandomWord(words);
            $('<div>' + randomWord + '</div>').data('number', randomWord).appendTo('#cardSlots').droppable({
                accept       : '#cardImages img'
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

        // 드롭된 카드의 이미지 경로 가져오기
        let imagePath = ui.draggable.attr('src');
        let slotNumber = $(this).data('number');
        let cardNumber = ui.draggable.data('number');
        if (slotNumber == cardNumber) {
            
            ui.draggable.addClass('correct');
            correctGames++;
        }
        
        // 카드의 위치를 고정
        ui.draggable.css({
            'position': 'absolute',
            'top': $(this).position().top,
            'left': $(this).position().left
        });

        ui.draggable.draggable('disable');
        $(this).droppable('disable');
        ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
        ui.draggable.draggable('option', 'revert', false);
        
        optGames++;
        checkGame(imagePath);
    }

    // 모든 카드의 드래그 활성화
    function enableGameElements() { $('#cardImages img').draggable('enable'); }

    function checkGame(imagePath){

        if(optGames == 3){
            
            rmGames--;
            if(rmGames == 0){
                alert("게임종료");
                endGames();
            }else{

                optGames     = 0;                       //초기화
                if(correctGames == 3){
                    sttBtn.innerHTML = "O";
                    addScore();
                }else
                    sttBtn.innerHTML = "X";
            
                correctGames = 0;    
                setTimeout(function() {
                    
                    init('able');
                }, 1000);                           // 1000밀리초 (1초) 후에 실행
            } 
        }else{

            //selectedCards = selectedCards.filter(card => card !== imagePath);
            //위에 영역에 카드 다섯장 다시 세팅
            remainingImagePaths.sort(function () { return Math.random() - .5 });        //기존에 사용되지 않았던 나머지 카드들, 이 중에 카드 한장 다시 선택해서 추가.
            //selectedCards.push(remainingImagePaths[0]);
            
            let selectedCardNames = [];
            for (var i = 0; i < 1; i++) {
            
                // 이미지 경로
                var imagePath = remainingImagePaths[i];
                let parts     = imagePath.split('/');
                let filename  = parts[parts.length - 1];                    // "거북이.jpg"
                let nameWithoutExtension = filename.split('.')[0];          // "거북이"
                // $('<img>').attr({
                //       'src': imagePath
                //     , 'id' : 'card'  + i
                //     , 'alt': 'Card ' + i
                // }).data('number', nameWithoutExtension).appendTo('#cardImages').draggable({
                //       containment: '#content'
                //     , stack: '#cardImages img'
                //     , cursor: 'move'
                //     , revert:   true
                //     , disabled: false                                // 드래그 비활성화
                // });
    
                // 이름을 selectedCardNames 배열에 추가
                //selectedCardNames.push(nameWithoutExtension);       // push 메서드 사용
                
                // 카드 순서 섞기
                let cardContainer = $('#cardImages');
                let cards = cardContainer.children('img').get();
                //shuffleArray(cards);
                //$.each(cards, function(idx, card) { cardContainer.append(card); });
                
                // 사용된 imagePath를 imagePaths에서 제거
                var index = imagePaths.indexOf(imagePath);
                if (index > -1) {
                    //imagePaths.splice(index, 1);                    // 해당 인덱스의 요소 제거
                }
            }

            // 추가된 이미지가 레이아웃을 깨지 않도록 Flexbox의 정렬을 유지
            //$('#cardImages').css('display', 'flex');
            //$('#cardImages').css('justify-content', 'center');
        }
    }

    // 배열을 섞는 함수
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function addScore(){

        let $point = $('#point');               // 제이쿼리로 요소 선택
        let score = parseInt($point.val()) + 1; // 문자열을 숫자로 변환하고 1을 더함
        $point.val(score);                      // 제이쿼리로 값 업데이트
    }
});