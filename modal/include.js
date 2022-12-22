import { Modal } from './modal.js'

switch(document.readyState){
  case 'complete': 
    window.main = new Main()
    break
  default: 
    window.addEventListener('load' , (function(){
      window.main = new Main()
    }))
    break
}

export class Main{
  constructor(){
    this.set_event()
  }
  get btn(){
    return document.getElementById('btn')
  }
  set_event(){
    this.btn.addEventListener('click' , this.click.bind(this))
  }
  click(e){
    this.modal = new Modal({
      caption : `モーダル表示テスト`,
      buttons : [
        {
          label : 'cancel',
          click : (()=>{
            alert('キャンセル')
            this.modal.close()
          }).bind(this),
        },
        {
          label : 'ok',
          click : (()=>{
            alert('OK')
            this.modal.close()
          }).bind(this),
        },
      ],
    })
  }
}