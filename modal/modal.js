export class Modal{
  constructor(options){
    this.options = options || {}
    this.id = 'modal_'+ (+new Date())
    this.view_bg()
    this.view()
  }
  get window(){
    return document.querySelector(`.modal_window[data-id='${this.id}']`)
  }
  get windows(){
    return document.querySelectorAll(`.modal_window`)
  }
  get content(){
    return this.window.querySelector('.modal_content')
  }
  get bg(){
    return document.querySelector(`.modal_bg`)
  }

  make_area(){
    const div = document.createElement('div')
    div.className = 'modal_window'
    div.setAttribute('data-active','before')
    div.setAttribute('data-id' , this.id)
    div.appendChild(this.make_close())
    div.appendChild(this.make_title())
    div.appendChild(this.make_caption())
    div.appendChild(this.make_content())
    div.appendChild(this.make_buttons())
    return div
  }
  make_title(){
    const div = document.createElement('div')
    div.className = 'modal_title'
    div.innerHTML = this.options.title || ''
    return div
  }
  make_caption(){
    const div = document.createElement('div')
    div.className = 'modal_caption'
    div.innerHTML = this.options.caption || ''
    return div
  }
  make_content(){
    const div = document.createElement('div')
    div.className = 'modal_content'
    div.insertAdjacentHTML('beforeend' , this.options.content || '')
    return div
  }
  make_close(){
    const div = document.createElement('div')
    div.className = 'modal_close'
    div.addEventListener('click' , this.close.bind(this))
    return div
  }
  make_buttons(){
    if(!this.options.buttons || !this.options.buttons.length){return}
    const div = document.createElement('div')
    div.className = 'modal_buttons'
    for(const button_data of this.options.buttons){
      const btn = document.createElement('button')
      btn.className = 'modal_button_cancel'
      btn.textContent = button_data.label || button_data.name || '--'
      if(button_data.click){
        btn.addEventListener('click' , button_data.click)
      }
      div.appendChild(btn)
    }
    return div
  }
  view(){
    this.area = this.make_area()
    document.body.appendChild(this.area)
    setTimeout(this.view_init.bind(this) , 0)
  }
  view_init(){
    this.area.setAttribute('data-active' , 'true')
  }
  view_bg(){
    if(this.bg){return}
    const bg = document.createElement('div')
    bg.className = 'modal_bg'
    document.body.appendChild(bg)
    return true
  }

  close(){
    const elms = this.windows
    for(const elm of elms){
      elm.parentNode.removeChild(elm)
    }
    if(this.bg){
      this.bg.parentNode.removeChild(this.bg)
    }
  }

}