const gc = document.querySelector('#game_console')
const gc_loc = gc.getBoundingClientRect()
var pl;

var cols = 40 // 
var rows = 22 // 
const tile_size = gc_loc.width*(100/cols/100)
const pl_size = tile_size*2
document.body.style.setProperty('--tile-line-height', pl_size+'px')

gc.style.width = '1000px'
gc.style.height = tile_size*rows+'px'

var gravity = 8,
    kd,
    x_speed = 5,
    pb_y = 0,
    score = 0,
    rot = 0,
    data_p = 0,
    bonus = 1,
    dead = false,
    kd_list = [],
    d = {},
    dbljump = false,
    dash = false,
    timer = 0,
    level_num = -1;

// уровень
const levels = [
  {
    start:'2,13',
    map: [8,8,8,8,8,8,8,8,0,0,0,0,0,0,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          8,0,0,0,0,8,8,8,0,1,1,1,1,0,8,8,8,0,0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,8,0,0,0,1,1,1,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,8,0,1,1,1,1,1,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,
          0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,8,8,8,8,8,
          0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,8,8,8,8,8,
          0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,3,0,8,8,8,8,8,
          0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,1,1,1,1,1,1,1,1,1,1,1,3,0,0,0,8,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,0,2,2,2,2,1,1,1,1,1,1,1,1,1,1,0,0,8,8,
          1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,8,8,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,8,8,
          1,1,1,1,1,1,1,1,1,1,0,8,0,1,1,1,1,1,0,8,8,8,8,8,8,0,1,1,1,1,1,1,1,1,1,1,1,0,0,8,
          0,0,0,0,0,1,1,1,1,1,0,8,0,2,2,2,2,2,0,8,8,8,8,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
          8,8,8,8,0,1,1,1,1,1,0,8,0,0,0,0,0,0,0,8,8,8,8,8,8,0,2,2,2,1,1,1,1,1,1,1,1,1,1,0,
          8,8,8,8,0,2,2,2,2,2,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,
          8,8,8,8,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0]

  },
  {
    start: '1,2',
    map: [0,0,0,0,0,8,8,8,0,0,0,0,0,0,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          1,1,1,1,0,0,0,0,0,4,4,4,4,0,8,8,8,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,
          1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,
          1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,
          1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,
          1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
          1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
          0,0,0,0,0,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,
          0,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,
          0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,
          0,1,1,1,1,1,1,1,0,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,
          0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,
          0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,9,
          0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,9,
          0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,9,
          0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,0,1,1,1,9,
          0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1,0,1,1,1,9,
          0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,8,0,1,1,1,1,1,1,1,1,1,0,1,1,1,9,
          0,0,0,0,0,1,1,1,1,1,1,1,0,2,2,2,2,2,0,0,0,0,0,0,8,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,
          8,8,8,8,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,8,8,8,8,8,8,0,2,2,2,1,1,1,1,1,1,0,8,8,8,8,
          8,8,8,8,0,2,2,2,2,2,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,1,1,1,1,1,1,0,8,8,8,8,
          8,8,8,8,0,0,0,0,0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,8,8,8,8]
  },
  {
    start: '2,13',
    map: [8,8,8,8,8,8,8,8,0,0,0,0,0,0,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          8,0,0,0,0,8,8,8,0,1,1,1,1,0,8,8,8,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,8,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,8,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,8,0,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,8,8,8,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,0,0,0,0,0,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,
          8,0,1,1,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,
          0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,8,8,8,8,8,
          0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,8,8,8,8,8,
          0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,8,8,8,8,8,
          0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,0,0,8,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,8,
          1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,8,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,8,8,
          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,8,
          0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
          8,8,8,8,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
          8,8,8,8,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,
          8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  }
]

function buildGame(){  
  // переходим на следующий уровень(чистим тайлы)
  gc.innerHTML = `<div id='player'></div><div id='game_alert'></div>`
  if(level_num < levels.length - 1) {
    level_num++  
  } else {
    level_num = 0
  }

  // рандомный цвет уровня
  document.body.style.setProperty('--root-clr', 'hsl('+Math.random()*360+'deg,50%,50%)')

  // добавляем тайлы для нового уровня
  for(var i=0;i<cols*rows;i++) {
    var d = document.createElement('div')
    d.className = 'tile'

    if(levels[level_num].map[i] == 0) {
      // d.className = Math.random() > .2 ? 'tile ground cube' : 'tile ground stripes'   
      d.className = 'tile ground' 
      // d.style.background = 'dimgray'
    }
    if(levels[level_num].map[i] == 2) {
      d.className = 'tile lava'      
    }  
    if(levels[level_num].map[i] == 3) {
      d.className = 'tile lava spleft'      
    }
    if(levels[level_num].map[i] == 4) {
      d.className = 'tile lava sptop'      
    }  
    if(levels[level_num].map[i] == 5) {
      d.className = 'tile lava spright'      
    }
    if(levels[level_num].map[i] == 6) {
      d.className = 'tile ground updown'      
    }
    if(levels[level_num].map[i] == 7) {
      d.className = 'tile ground leftright'      
    }
    if(levels[level_num].map[i] == 8) {
      d.className = 'tile innerwall'      
    }
    if(levels[level_num].map[i] == 9) {
      d.className = 'tile nextlevel'      
    }
    d.setAttribute('grid_loc', [i % cols,Math.floor(i/cols)])
    d.style.width = tile_size + 'px'
    d.style.height = tile_size + 'px'
    d.style.position = 'absolute'
    // d.innerHTML = i
    // d.style.outline = '1px dotted gray'
    d.style.left = (i % cols)*tile_size + 'px'
    d.style.top = Math.floor(i/cols)*tile_size + 'px'

    gc.appendChild(d)
  }    

  
  const ga = document.querySelector('#game_alert')
  var pl = document.querySelector('#player')
  pl.style.width = tile_size + 'px'
  pl.style.height = tile_size + 'px'
  pl.style.top = (tile_size*levels[level_num].start.split(',')[1]) + 'px'
  pl.style.left = (tile_size*levels[level_num].start.split(',')[0]) + 'px'

  // окошко для тупых
  ga.innerHTML = 'Управление стрелками<br>двойной прыжок / скольжение по стенам'
  ga.style.opacity = '1'

  var pl_loc = pl.getBoundingClientRect() 
  var x = pl_loc.left

  function updatePlayer() {
    // поинты в зависимости о тположения игрока
    var pl_loc = pl.getBoundingClientRect()  
    var pl_center = document.elementFromPoint(pl_loc.x + (tile_size*.5), pl_loc.y + (tile_size*.75))
    var pl_xy1 = document.elementFromPoint(pl_loc.x + (pl_loc.width*.25), pl_loc.y + pl_loc.height + gravity)
    var pl_xy2 = document.elementFromPoint(pl_loc.x + (pl_loc.width*.75), pl_loc.y + pl_loc.height + gravity)
    var pl_xy3 = document.elementFromPoint(pl_loc.x - (x_speed*.15), pl_loc.y + (pl_loc.height*.5))
    var pl_xy4 = document.elementFromPoint(pl_loc.x + pl_loc.width + (x_speed*.10), pl_loc.y + (pl_loc.height*.5))
    var pl_xy5 = document.elementFromPoint(pl_loc.x + (pl_loc.width*.5), pl_loc.y - (gravity*.5))
    var pl_xy6 = document.elementFromPoint(pl_loc.x + (pl_size*.5), pl_loc.y + pl_size)

    // console.log(pl_center)

    function endGame() {
      alert('смерть')
    }

    //стоп при смерти
    if(!pl_xy1 || !pl_xy2 || dead) {
      // endGame() ???
    } else { 

     
      // координаты игрока при касании
      if(pl_xy1.classList.contains('ground') ||
         pl_xy2.classList.contains('ground')) {
        gravity = 0
      } else {
        if(gravity < 8) {
          gravity += .51
        } else {
          gravity = 8
        }
      }
      pl.style.top = pl_loc.top - 6.25 - gc_loc.top + gravity + 'px'
      // console.log(gravity)    

      // + высота прыжка
      if(d[38] && gravity == 0) {  
        dbljump = false
        gravity = -9
      } 
      if(d[38] && gravity > 0) {
        if(!dbljump) {
          gravity = -9 
        }      
        dbljump = true
      } 

      // смотрим на движение в лево и вправо
      if(d[37] && x > gc_loc.x) {
        if(!pl_xy3.classList.contains('ground')) { 
          x -= x_speed
          pl.className = ''
          pl.classList.add('goleft')

        } else {
          pl.className = ''

          if(gravity > 0) {
            dbljump = false
            gravity = 1
            pl.style.transform = 'rotate(90deg)'
          }
        }
      } 

      // считаем скорость
      if(d[39] && x + pl_loc.width < gc_loc.x + gc_loc.width) {
        if(!pl_xy4.classList.contains('ground')) {        
          x += x_speed
          pl.className = ''
          pl.classList.add('goright')
        } else {
          pl.className = ''

          if(gravity > 0) {
            dbljump = false
            gravity = 1
            pl.style.transform = 'rotate(-90deg)'
          } 
        }
      } 

      pl.style.left = x - gc_loc.left + 'px'
      // pl.style.left = x + x_speed - gc_loc.left + 'px'

      // меняем возмождность в зависимости от тайла
      if(pl_xy5.classList.contains('ground')) {
        gravity = 8
      } 

      if(pl_center.classList.contains('lava')) {
        // console.log('lava')
        pl.style.top = (tile_size*levels[level_num].start.split(',')[1]) + 'px'
        pl.style.left = (tile_size*levels[level_num].start.split(',')[0]) + 'px'
        pl_loc = pl.getBoundingClientRect()
        x = pl_loc.left
      }
      if(pl_center.classList.contains('nextlevel')) {
        buildGame()
      }

      // вывод на концовку (не работает?)
      //       if(pl_center.classList.contains('finalgoal')) {
      //         pl_center.style.display = 'none'
      //         var clr = pl_center.style.background
      //         var doors = document.querySelectorAll('.rocket')
      //         doors.forEach(function(elm){
      //           elm.style.display = 'none'
      //         })

      //         setTimeout(function(){
      //           pl.style.opacity = '0'
      //           document.body.style.setProperty('--pl-clr', 'transparent')
      //           document.querySelector('#big_rocket').classList.add('adios')
      //           setTimeout(function(){
      //             var time = (timer/30)
      //             ga.innerHTML = '<h2>YOU WIN!</h2>'+time.toFixed(2)+' seconds'
      //             ga.style.opacity = '1'            
      //           }, 2250)
      //         }, 250)      
      //       }

      timer++
      playerTrail()
      setTimeout(updatePlayer, 1000/45) // update player 30-60 times a second
    }  
  }

  updatePlayer()

  // "хвостик" за игроком
  function playerTrail() {
    let x = pl.getBoundingClientRect().x
    let y = pl.getBoundingClientRect().y
    let b = document.createElement('div')
    b.className = 'trailBall'
    b.style.left = x + 7.5 - gc_loc.left + 'px'
    b.style.top = y + 2.5 - gc_loc.top + 'px'
    b.onanimationend = function(){
      b.remove()
    }
    gc.appendChild(b)
  }

  window.addEventListener('keydown', function(e) { 
    d[e.which] = true;
  })
  window.addEventListener('keyup', function(e) {   
    d[e.which] = false; 
    pl.className = ''
    pl.style.transform = 'rotate(0deg)'
  })
}

window.addEventListener('load', buildGame)
window.focus()