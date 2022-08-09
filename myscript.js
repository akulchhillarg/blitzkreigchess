var board = Chessboard('myBoard', {
  position:"start",
  draggable: true,
  onDrop:onDrop,
  onChange: check_status
})
var chess = new Chess()
var blitz_square = null

var whiteSquareHighlight = '#b50404'
var blackSquareHighlight = '#b50404'

var timer_start= 30

function get_blitz_square(){
  const files = ['a','b','c','d','e','f','g','h']
  const ranks = [1,2,3,4,5,6,7,8]
  let random_file = files[Math.floor(Math.random()*files.length)]
  let random_rank = ranks[Math.floor(Math.random()*ranks.length)]
  blitz_square =  random_file+random_rank
  if((chess.get(blitz_square)) && (chess.get(blitz_square).type=='k'))
  {get_blitz_square()}
}

function onDrop(source, target){
  
  var move = chess.move({
    from: source,
    to: target,
    promotion: 'q',
    sloppy: true
})
if (move === null) return 'snapback'
let h= helper(source, target,move)
h.then(data=>data)

}

async function helper (source, target,move){

if(move.flags=='cp'){
  chess.put({ type: chess.QUEEN, color: move.color })
  board.position(chess.fen())
  console.log("Queenig",chess.fen(),board.fen())
}

await sleep(100) 
board.position(chess.fen(),false)


}

function destroy_blitz_square(square){
  chess.remove(square)
  board.position(chess.fen())
}

function highlight_blitz_square (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareHighlight
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareHighlight
  }

  $square.css('background', background)
}

function remove_highlight_blitz_square () {
  $('#myBoard .square-55d63').css('background', '')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function start_blitz(){

  board = Chessboard('myBoard')
  
  board = Chessboard('myBoard', {
    position:chess.fen(),
    draggable: false,
    
  })

  get_blitz_square()
  highlight_blitz_square(blitz_square)
  await sleep(1000)
  destroy_blitz_square(blitz_square)
  remove_highlight_blitz_square(blitz_square)

  board = Chessboard('myBoard', {
    position:chess.fen(),
    draggable: true,
  onDrop:onDrop,
  onChange: check_status
  })
}


function update_status(t){
  let ele = document.getElementById('status')
  ele.innerText = "Blitz Krieg in " + t + " seconds"

  let ply = document.getElementById('playing')
  if (chess.turn()=='w'){ply.innerText = 'White To Play'}
  else{ply.innerText = 'Black To Play'}
}


function check_status(){
  
  if(chess.game_over()){

    if (chess.in_checkmate()){
      
    

    if((chess.turn()=='w') && (chess.in_check())  )
    {document.getElementById('playing').innerText = 'White is checkmated'}

    if((chess.turn()=='b') && (chess.in_check()) )
    {document.getElementById('playing').innerText = 'Black is checkmated'}
    
    

    
  }
    if (chess.in_draw()){
      document.getElementById('playing').innerText = 'Game Drawn by 50 move check'}
    if (chess.in_stalemate()){document.getElementById('playing').innerText = 'Game Drawn by stalemate'}
    if (chess.in_threefold_repetition()){
      document.getElementById('playing').innerText = 'Game Drawn by 3 fold repetion'}
    if (chess.insufficient_material()){
      document.getElementById('playing').innerText = 'Game Drawn by insufficient material'}
    clearInterval(interval)
    
  }
}



const interval= setInterval(function() {
  if (timer_start == 0) {
    timer_start = 30
    start_blitz()
  }
  timer_start = timer_start - 1
  update_status(timer_start)
},1000)




