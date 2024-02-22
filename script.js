// @ts-nocheck
const AccordianNav = class extends HTMLElement {
  constructor() {
      super();
      this.current = []
      this.oldHeight = 0
      this.getTotalHeight = this.getTotalHeight
      this.querySelectorAll('.--open').forEach(el => {
          const totalHeight = this.getTotalHeight(el)
          const nav = el.parentNode;
          nav.style.height = totalHeight + 'px'
          this.rotateCross(nav, false, true)
      })
      this.h3 = this.querySelectorAll('.menu_item');

      if(!this.h3.length) return;
      for(let h3 of this.h3) h3.addEventListener('click', (event) => {
          this.showNav(this.querySelectorAll('.accordian__menu_items[style]'), event.target)
      });

      // Open nav on page load 
      if(this.openOnPageLoad) this.showNav(this.openOnPageLoad) 
      this.onMutation()
  }

  onMutation() {
      const that = this
      const observer = new MutationObserver(function(mutationList) { 
          const target = mutationList[0].target
          if(window.innerWidth < 767) {
              if(target.nodeName == "LI") {
                  const accordianMenuItem = target.parentNode.parentNode
                  const h3 = accordianMenuItem.children[0]
   
                  /* If menu item is open then allow the item to adjust height */
                  if (that.current === accordianMenuItem) 
                  accordianMenuItem.style.height = that.getTotalHeight(h3) + 'px'
              }
          }
      });
      observer.observe(this, {childList: true, subtree: true, characterDataOldValue: true});
  }
  

  /**
   * 
   * @param {HTMLElement} target element to open or close
   * @param {HTMLElement} current current element that is open
   * @param {Boolean} open 
   */
  rotateCross(target, current, open) {
      if(!target) return;

      if(current) {
          const currentCross = current.querySelector('.nav_state')
          currentCross.style.transform = null 
      } 
      const targetCross = target.querySelector('.nav_state')
      if(open) {
          return targetCross.style.transform = 'rotate(180deg)';
      }
      targetCross.style.transform = null
  }

  /**
   * 
   * @param {HTMLElement} target element height to open nav to, the H3 element which usually was clicked on
   */
  getTotalHeight(target) {
      try {
          this.startHeight = target.getBoundingClientRect().height
          const styles = window.getComputedStyle(target.nextElementSibling)
          const margin = parseFloat(styles['marginTop']) +
                      parseFloat(styles['marginBottom']);
          return Math.ceil(target.nextElementSibling.offsetHeight + margin + this.startHeight)
      } catch(e) {
          return 0
      }
  }

  /**
   * @param {HTMLElements} openElements node list of all open elements to close
   * @param {HTMLElement|Boolean} target target element either clicked on to open or close or element to have automatically open on page load
   * @type {(event: Event) => void}
   */
  showNav(openElements, target=false) {
      if(!openElements) return;
      const targetParent = target?.parentNode

      if(targetParent.style.height) {
          targetParent.removeAttribute('style')
          return targetParent.querySelector('.nav_state').removeAttribute('style');
      } 

      // Nav open
      if(!targetParent.style.height) {
          const totalHeight = this.getTotalHeight(target)
          targetParent.style.height = totalHeight + 'px'
          targetParent.querySelector('.nav_state').style.transform = 'rotate(180deg)';
      } 
      /* 
      *  Current open nav closes
      */
      openElements.forEach(el => {
          this.rotateCross(el, false, false)
          el.removeAttribute('style')
      })
  }
}

customElements.define('accordian-nav', AccordianNav);




