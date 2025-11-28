import Arrow from "./arrow";

class Game {
  constructor(stage) {
    this.stage = stage;
    this.started = false;
    this.paused = false;
    this.LleftArrows = [];
    this.LdownArrows = [];
    this.LupArrows = [];
    this.LrightArrows = [];
    this.RleftArrows = [];
    this.RdownArrows = [];
    this.RupArrows = [];
    this.RrightArrows = [];
    this.play = this.play.bind(this);
    this.music = new Audio('./assets/songs/paranoia.mp3');
    this.music.loop = true;
    this.music.volume = 0.1;
    
    // 음악이 끝날 때 이벤트 처리
    this.music.addEventListener('ended', () => {
      if (this.started && !this.paused) {
        this.endGame();
      }
    });
    this.youtubePlayer = null;
    this.reset();
    
    // URL 파라미터 처리
    this.handleUrlParams();
    
    // Pause 메뉴 이벤트
    document.getElementById("resumeBtn").addEventListener("click", () => {
      this.resumeGame();
    });
    
    document.getElementById("mainMenuBtn").addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Game Over 메뉴 이벤트
    document.getElementById("playAgainBtn").addEventListener("click", () => {
      this.playAgain();
    });
    
    document.getElementById("goToMainBtn").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  loadYouTubeVideo(url) {
    // YouTube URL에서 비디오 ID 추출
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      alert('유효한 YouTube URL을 입력해주세요.');
      return;
    }

    // 기존 플레이어가 있으면 제거
    if (this.youtubePlayer) {
      this.youtubePlayer.destroy();
    }

    // YouTube 모드일 때 canvas는 유지하되, 배경만 투명하게 설정
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.style.background = 'transparent';
    }

    // YouTube iframe API를 사용하여 백그라운드에서 재생
    this.youtubePlayer = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        'autoplay': 1,
        'controls': 0,
        'disablekb': 1,
        'enablejsapi': 1,
        'fs': 0,
        'iv_load_policy': 3,
        'modestbranding': 1,
        'playsinline': 1,
        'rel': 0,
        'showinfo': 0
      },
      events: {
        'onReady': (event) => {
          console.log('YouTube video loaded');
          // 음악 볼륨을 0으로 설정하여 YouTube 오디오만 들리도록
          this.music.volume = 0;
          // YouTube 비디오 자동 재생 시도
          event.target.playVideo();
          this.youtubeReady = true;
        },
        'onStateChange': (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            console.log('YouTube video started playing');
          } else if (event.data === YT.PlayerState.ENDED) {
            console.log('YouTube video ended');
            this.endGame();
          }
        }
      }
    });
    this.youtubeReady = false;
  }

  extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty') || 'standard';
    const gameMode = urlParams.get('mode') || 'multi';
    const youtubeUrl = urlParams.get('youtube');
    const song = urlParams.get('song');
    
    // 게임 모드 설정
    this.gameMode = gameMode;
    
    if (youtubeUrl) {
      setTimeout(() => this.loadYouTubeVideo(youtubeUrl), 500);
    } else if (song) {
      this.music.src = `./assets/songs/${song}`;
    }
    
    // Single player 모드일 때 Player 2 점수 숨기기
    if (gameMode === 'single') {
      const player2Container = document.getElementById('player2ScoreContainer');
      if (player2Container) {
        player2Container.style.display = 'none';
      }
      
      // Player 1 점수 컨테이너를 중앙으로 이동
      const player1Container = document.getElementById('player1ScoreContainer');
      if (player1Container) {
        player1Container.style.left = '50%';
        player1Container.style.transform = 'translateX(-50%)';
        player1Container.style.right = 'auto';
      }
    }
    
    // 자동으로 게임 시작
    setTimeout(() => {
      this.play(difficulty);
    }, 1000);
  }

  pauseGame() {
    this.paused = true;
    this.music.pause();
    if (this.youtubePlayer) {
      this.youtubePlayer.pauseVideo();
    }
    createjs.Ticker.paused = true;
    document.getElementById("pauseModal").classList.add("visible");
  }

  resumeGame() {
    this.paused = false;
    this.music.play();
    if (this.youtubePlayer) {
      this.youtubePlayer.playVideo();
    }
    createjs.Ticker.paused = false;
    document.getElementById("pauseModal").classList.remove("visible");
  }

  reset() {
    this.score = 0;
    this.player1Score = 0;
    this.player2Score = 0;
    this.updateScore();
    this.updatePlayerScores();
    this.clearArrows();
    createjs.Ticker.removeAllEventListeners();
    this.stage.update();
    clearInterval(this.myInt);
    clearTimeout(this.musicEndTimeout);
  }

  clearArrows() {
    this.LleftArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LdownArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LupArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LrightArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RleftArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RdownArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RupArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RrightArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LleftArrows = [];
    this.LdownArrows = [];
    this.LupArrows = [];
    this.LrightArrows = [];
    this.RleftArrows = [];
    this.RdownArrows = [];
    this.RupArrows = [];
    this.RrightArrows = [];
  }

  play(difficulty) {
    this.started = true;
    let speed;
    switch(difficulty) {
      case "light":
        speed = 3.5;
        break;
      case "standard":
        speed = 7.0;
        break;
      case "heavy":
        speed = 7.0;
        break;
    }

    this.reset();
    clearTimeout(this.t1);
    clearTimeout(this.t2);
    clearTimeout(this.t3);
    clearTimeout(this.t4);
    clearTimeout(this.musicEndTimeout);
    this.music.play();
    
    // YouTube 비디오가 준비되었고 아직 재생되지 않았다면 재생 시작
    if (this.youtubePlayer && this.youtubeReady) {
      try {
        this.youtubePlayer.playVideo();
      } catch (error) {
        console.log('YouTube video play failed, will retry on user interaction:', error);
      }
    }

    let that = this;

    setInterval(() => {speed *= 1.0007;} , 100 );
    this.myInt = setInterval( randomGen, 7000 / 3 / speed );

    this.t1 = setTimeout(() => {
      clearInterval(this.myInt);
      if (this.life > 0) {
        this.myInt = setInterval( randomGen, 7500 / 3 / speed);
      }
    }, 52500);

    this.t2 = setTimeout(() => {
      clearInterval(this.myInt);
      if (this.life > 0) {
        this.myInt = setInterval( randomGen, 8000 / 3 / speed);
      }
    }, 105000);

    this.t3 = setTimeout(() => {
      clearInterval(this.myInt);
      if (this.life > 0) {
        this.myInt = setInterval( randomGen, 8500 / 3 / speed);
      }
    }, 157500);

    this.t4 = setTimeout(() => {
      clearInterval(this.myInt);
      if (this.life > 0) {
        this.myInt = setInterval( randomGen, 9000 / 3 / speed);
      }
    }, 210000);

    // 음악이 로드된 후 화살표 생성을 조절
    const setupMusicEnd = () => {
      if (this.music.duration && !isNaN(this.music.duration)) {
        // 음악이 끝나기 5초 전에 화살표 생성을 멈춤
        const stopTime = (this.music.duration - 5) * 1000;
        if (stopTime > 0) {
          this.musicEndTimeout = setTimeout(() => {
            clearInterval(this.myInt);
          }, stopTime);
        }
      }
    };

    // 음악이 로드되면 설정
    if (this.music.readyState >= 2) {
      setupMusicEnd();
    } else {
      this.music.addEventListener('loadedmetadata', setupMusicEnd);
    }

    let tick = createjs.Ticker;
    tick.setFPS(30);

    const LcreateLeftArrow = () => {
      let leftMovingArrow = new Arrow.LleftArrow();
      that.LleftArrows.push(leftMovingArrow);
      that.stage.addChild(leftMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", leftTick);
      leftMovingArrow.listener = listener;

      function leftTick(event) {
        leftMovingArrow.y = leftMovingArrow.y + speed;
        if (that.LleftArrows[0] && that.LleftArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.LleftArrows[0]);
          that.LleftArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    const LcreateDownArrow = () => {
      let downMovingArrow = new Arrow.LdownArrow();
      that.LdownArrows.push(downMovingArrow);
      that.stage.addChild(downMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", downTick);
      downMovingArrow.listener = listener;

      function downTick(event) {
        downMovingArrow.y = downMovingArrow.y + speed;
        if (that.LdownArrows[0] && that.LdownArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.LdownArrows[0]);
          that.LdownArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    const LcreateUpArrow = () => {
      let upMovingArrow = new Arrow.LupArrow();
      that.LupArrows.push(upMovingArrow);
      that.stage.addChild(upMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", upTick);
      upMovingArrow.listener = listener;

      function upTick(event) {
        upMovingArrow.y = upMovingArrow.y + speed;
        if (that.LupArrows[0] && that.LupArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.LupArrows[0]);
          that.LupArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    const LcreateRightArrow = () => {
      let rightMovingArrow = new Arrow.LrightArrow();
      that.LrightArrows.push(rightMovingArrow);
      that.stage.addChild(rightMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", rightTick);
      rightMovingArrow.listener = listener;

      function rightTick(event) {
        rightMovingArrow.y = rightMovingArrow.y + speed;
        if (that.LrightArrows[0] && that.LrightArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.LrightArrows[0]);
          that.LrightArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    const RcreateLeftArrow = () => {
      let leftMovingArrow = new Arrow.RleftArrow();
      // Single Player 모드일 때 화살표를 중앙으로 이동
      if (that.gameMode === 'single') {
        leftMovingArrow.x = 25; // 중앙 왼쪽 위치
      }
      that.RleftArrows.push(leftMovingArrow);
      that.stage.addChild(leftMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", leftTick);
      leftMovingArrow.listener = listener;

      function leftTick(event) {
        leftMovingArrow.y = leftMovingArrow.y + speed;
        if (that.RleftArrows[0] && that.RleftArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.RleftArrows[0]);
          that.RleftArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    const RcreateDownArrow = () => {
      let downMovingArrow = new Arrow.RdownArrow();
      // Single Player 모드일 때 화살표를 중앙으로 이동
      if (that.gameMode === 'single') {
        downMovingArrow.x = 100; // 중앙 아래 위치
      }
      that.RdownArrows.push(downMovingArrow);
      that.stage.addChild(downMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", downTick);
      downMovingArrow.listener = listener;

      function downTick(event) {
        downMovingArrow.y = downMovingArrow.y + speed;
        if (that.RdownArrows[0] && that.RdownArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.RdownArrows[0]);
          that.RdownArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    const RcreateUpArrow = () => {
      let upMovingArrow = new Arrow.RupArrow();
      // Single Player 모드일 때 화살표를 중앙으로 이동
      if (that.gameMode === 'single') {
        upMovingArrow.x = 175; // 중앙 위 위치
      }
      that.RupArrows.push(upMovingArrow);
      that.stage.addChild(upMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", upTick);
      upMovingArrow.listener = listener;

      function upTick(event) {
        upMovingArrow.y = upMovingArrow.y + speed;
        if (that.RupArrows[0] && that.RupArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.RupArrows[0]);
          that.RupArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    const RcreateRightArrow = () => {
      let rightMovingArrow = new Arrow.RrightArrow();
      // Single Player 모드일 때 화살표를 중앙으로 이동
      if (that.gameMode === 'single') {
        rightMovingArrow.x = 250; // 중앙 오른쪽 위치
      }
      that.RrightArrows.push(rightMovingArrow);
      that.stage.addChild(rightMovingArrow);
      that.stage.update();
      let listener = tick.on("tick", rightTick);
      rightMovingArrow.listener = listener;

      function rightTick(event) {
        rightMovingArrow.y = rightMovingArrow.y + speed;
        if (that.RrightArrows[0] && that.RrightArrows[0].y > 760) {
          that.miss();
          that.stage.removeChild(that.RrightArrows[0]);
          that.RrightArrows.shift();
          tick.off("tick", listener);
        }
        that.stage.update(event);
      }
    };

    function randomGen() {
      let randArrow = Math.floor(Math.random() * 8) + 1; // 더 다양한 패턴을 위해 8개로 확장
      let randDouble = Math.random() * 100 + 1;
      
      // 난이도에 따른 노트 밀도 조절
      if (difficulty === "heavy") {
        if (randDouble > 60) { // heavy에서는 더 많은 노트
          randArrow += 4;
        }
      } else if (difficulty === "standard") {
        if (randDouble > 75) { // standard에서는 중간 밀도
          randArrow += 4;
        }
      } else { // light
        if (randDouble > 85) { // light에서는 적은 노트
          randArrow += 4;
        }
      }

      // Single player 모드일 때는 오른쪽 화살표만 생성
      if (that.gameMode === 'single') {
        switch(randArrow) {
          case 1: RcreateLeftArrow();  break;
          case 2: RcreateDownArrow();  break;
          case 3: RcreateUpArrow();    break;
          case 4: RcreateRightArrow(); break;
          case 5: break; // 빈 공간
          case 6: break; // 빈 공간
          case 7: break; // 빈 공간
          case 8: break; // 빈 공간
          case 9: break; // 빈 공간
          case 10: break; // 빈 공간
          case 11: break; // 빈 공간
          case 12: break; // 빈 공간
          default: break;
        }
      } else {
        // Multi player 모드일 때는 양쪽 화살표 모두 생성
        switch(randArrow) {
          case 1: RcreateLeftArrow();  break;
          case 2: RcreateDownArrow();  break;
          case 3: RcreateUpArrow();    break;
          case 4: RcreateRightArrow(); break;
          case 5: break; // 빈 공간
          case 6: LcreateLeftArrow();  break;
          case 7: LcreateDownArrow();  break;
          case 8: LcreateUpArrow();    break;
          case 9: LcreateRightArrow(); break;
          case 10: break; // 빈 공간
          case 11: break; // 빈 공간
          case 12: break; // 빈 공간
          default: break;
        }
      }
    }
  }

  check(arrows, direction) {
    // 첫 번째 키 입력 시 YouTube 비디오 재생 시도 (사용자 상호작용)
    if (this.youtubePlayer && this.youtubeReady) {
      try {
        const playerState = this.youtubePlayer.getPlayerState();
        if (playerState === YT.PlayerState.UNSTARTED || playerState === YT.PlayerState.PAUSED) {
          this.youtubePlayer.playVideo();
        }
      } catch (error) {
        console.log('YouTube video play attempt:', error);
      }
    }
    
    let pressed;
    let isPlayer1 = direction.startsWith('l_'); // l_로 시작하면 Player 1
    
    // Single Player 모드에서는 항상 Player 1로 처리
    if (this.gameMode === 'single') {
      isPlayer1 = true;
    }
    
    switch(direction) {
      case "l_left":
        pressed = new Arrow.LleftPressedArrow();
        break;
      case "l_down":
        pressed = new Arrow.LdownPressedArrow();
        break;
      case "l_up":
        pressed = new Arrow.LupPressedArrow();
        break;
      case "l_right":
        pressed = new Arrow.LrightPressedArrow();
        break;
      case "r_left":
        pressed = new Arrow.RleftPressedArrow();
        // Single Player 모드일 때는 중앙 위치로 이동
        if (this.gameMode === 'single') {
          pressed.x = 25;
        }
        break;
      case "r_down":
        pressed = new Arrow.RdownPressedArrow();
        // Single Player 모드일 때는 중앙 위치로 이동
        if (this.gameMode === 'single') {
          pressed.x = 100;
        }
        break;
      case "r_up":
        pressed = new Arrow.RupPressedArrow();
        // Single Player 모드일 때는 중앙 위치로 이동
        if (this.gameMode === 'single') {
          pressed.x = 175;
        }
        break;
      case "r_right":
        pressed = new Arrow.RrightPressedArrow();
        // Single Player 모드일 때는 중앙 위치로 이동
        if (this.gameMode === 'single') {
          pressed.x = 250;
        }
        break;
    }
    this.stage.addChild(pressed);
    this.stage.update();
    setTimeout( () => this.stage.removeChild(pressed), 100);

    if (arrows[0] && arrows[0].y > 585 && arrows[0].y < 615) {
      this.hit("excellent", isPlayer1);
      createjs.Ticker.off("tick", arrows[0].listener);
      this.stage.removeChild(arrows[0]);
      arrows.shift();
    } else if (arrows[0] && arrows[0].y > 570 && arrows[0].y < 630) {
      this.hit("great", isPlayer1);
      createjs.Ticker.off("tick", arrows[0].listener);
      this.stage.removeChild(arrows[0]);
      arrows.shift();
    } else if (arrows[0]) {
      // 화살표가 있지만 타이밍이 맞지 않을 때만 miss
      this.miss(isPlayer1);
    }
  }

  hit(tier, isPlayer1) {
    let hitMessageBorder;
    let hitMessage;
    let points = 0;
    
    if (tier === "excellent") {
      points = 100;
      hitMessageBorder = new createjs.Text("Excellent!", "40px Impact", "black");
      hitMessageBorder.outline = 2;
      hitMessage = hitMessageBorder.clone();
      hitMessage.outline = 0;
      hitMessage.color = "#ffff80";
    } else if (tier === "great") {
      points = 50;
      hitMessageBorder = new createjs.Text("Great!", "40px Impact", "black");
      hitMessageBorder.outline = 2;
      hitMessage = hitMessageBorder.clone();
      hitMessage.outline = 0;
      hitMessage.color = "#80ff80";
    }

    // 플레이어별 위치 설정
    if (isPlayer1) {
      hitMessageBorder.x = 100; // Player 1 영역 (왼쪽)
      hitMessageBorder.y = 225;
      hitMessage.x = 100;
      hitMessage.y = 225;
    } else {
      hitMessageBorder.x = 500; // Player 2 영역 (오른쪽)
      hitMessageBorder.y = 225;
      hitMessage.x = 500;
      hitMessage.y = 225;
    }

    // 플레이어별 점수 업데이트
    if (isPlayer1) {
      this.player1Score += points;
    } else {
      this.player2Score += points;
    }

    this.stage.addChild(hitMessage, hitMessageBorder);
    this.stage.update();
    setTimeout( () => {
      this.stage.removeChild(hitMessage, hitMessageBorder);
    }, 200);

    this.updatePlayerScores();
  }

  miss(isPlayer1) {
    // 플레이어별 점수 감소 (마이너스 가능)
    if (isPlayer1) {
      this.player1Score -= 20;
    } else {
      this.player2Score -= 20;
    }
    
    let missMessageBorder = new createjs.Text("Missed...", "40px Impact", "black");
    missMessageBorder.outline = 2;
    let missMessage = missMessageBorder.clone();
    missMessage.outline = 0;
    missMessage.color = "red";
    
    // 플레이어별 위치 설정
    if (isPlayer1) {
      missMessageBorder.x = 100; // Player 1 영역 (왼쪽)
      missMessageBorder.y = 275;
      missMessage.x = 100;
      missMessage.y = 275;
    } else {
      missMessageBorder.x = 500; // Player 2 영역 (오른쪽)
      missMessageBorder.y = 275;
      missMessage.x = 500;
      missMessage.y = 275;
    }
    
    this.stage.addChild(missMessage, missMessageBorder);
    this.stage.update();

    setTimeout( () => {
      this.stage.removeChild(missMessage, missMessageBorder);
    }, 200);
    
    this.updatePlayerScores();
  }

  gameOver() {
    this.showGameOverModal();
    this.clearArrows();
    this.music.pause();
    if (this.youtubePlayer) {
      this.youtubePlayer.pauseVideo();
    }
    clearInterval(this.myInt);
    clearTimeout(this.t1);
    clearTimeout(this.t2);
    clearTimeout(this.t3);
    clearTimeout(this.t4);
    clearTimeout(this.musicEndTimeout);
  }

  endGame() {
    // YouTube 비디오가 끝났을 때 게임 종료
    this.showGameOverModal(true); // true는 곡 완주를 의미
    this.clearArrows();
    this.music.pause();
    if (this.youtubePlayer) {
      this.youtubePlayer.pauseVideo();
    }
    clearInterval(this.myInt);
    clearTimeout(this.t1);
    clearTimeout(this.t2);
    clearTimeout(this.t3);
    clearTimeout(this.t4);
    clearTimeout(this.musicEndTimeout);
  }

  updateScore() {
    let score = document.getElementById("score");
    if (score) {
      score.innerHTML = this.score;
    }
  }

  updatePlayerScores() {
    let player1Score = document.getElementById("player1Score");
    let player2Score = document.getElementById("player2Score");
    if (player1Score) {
      player1Score.innerHTML = this.player1Score;
    }
    if (player2Score) {
      player2Score.innerHTML = this.player2Score;
    }
  }

  showGameOverModal(isSongComplete = false) {
    // 최종 점수 업데이트
    document.getElementById("finalPlayer1Score").innerHTML = this.player1Score;
    document.getElementById("finalPlayer2Score").innerHTML = this.player2Score;
    
    // Single Player 모드일 때 Player 2 점수 숨기기
    if (this.gameMode === 'single') {
      const player2ScoreElement = document.querySelector("#gameOverModal .final-scores .player-score:last-child");
      if (player2ScoreElement) {
        player2ScoreElement.style.display = 'none';
      }
      // Single Player에서는 Player 1 점수만 총점으로 표시
      document.getElementById("finalTotalScore").innerHTML = this.player1Score;
    } else {
      const player2ScoreElement = document.querySelector("#gameOverModal .final-scores .player-score:last-child");
      if (player2ScoreElement) {
        player2ScoreElement.style.display = 'block';
      }
      // Multi Player에서는 두 플레이어 점수 합계
      document.getElementById("finalTotalScore").innerHTML = this.player1Score + this.player2Score;
    }
    
    // 게임 오버 모달 제목 변경
    const gameOverTitle = document.querySelector("#gameOverModal h2");
    if (isSongComplete) {
      gameOverTitle.innerHTML = "SONG COMPLETE!";
      gameOverTitle.style.color = "#00ff00";
    } else {
      gameOverTitle.innerHTML = "GAME OVER!";
      gameOverTitle.style.color = "#ff0000";
    }
    
    // 모달 표시
    document.getElementById("gameOverModal").classList.add("visible");
  }

  playAgain() {
    // 모달 숨기기
    document.getElementById("gameOverModal").classList.remove("visible");
    
    // Single Player 모드일 때 Player 2 점수 다시 표시 (게임 재시작을 위해)
    if (this.gameMode === 'single') {
      const player2ScoreElement = document.querySelector("#gameOverModal .final-scores .player-score:last-child");
      if (player2ScoreElement) {
        player2ScoreElement.style.display = 'block';
      }
    }
    
    // 게임 리셋 및 재시작
    this.reset();
    
    // URL 파라미터에서 난이도 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty') || 'standard';
    
    // 게임 재시작
    setTimeout(() => {
      this.play(difficulty);
    }, 500);
  }
}

export default Game;
