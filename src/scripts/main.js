import Alpine from 'alpinejs'

// Load content from JSON
let siteContent = {}

async function loadContent() {
  try {
    const response = await fetch('/data/content.json')
    siteContent = await response.json()
    
    // Update page title
    document.title = siteContent.site.title
    
    // Debug: Log the loaded content
    console.log('Loaded siteContent:', siteContent)
    console.log('Images in content:', siteContent.images)
    
    // Populate content
    populateContent()
  } catch (error) {
    console.error('Error loading content:', error)
  }
}

function populateContent() {
  // Helper function to safely set text content
  const setText = (selector, text) => {
    const element = document.querySelector(selector)
    if (element && text) element.textContent = text
  }
  
  // Helper function to render rich text with links and icons
  const setRichText = (selector, content) => {
    const element = document.querySelector(selector)
    if (!element) return
    
    if (typeof content === 'string') {
      element.textContent = content
      return
    }
    
    if (content?.content && content?.links) {
      let html = content.content
      
      // Replace each link placeholder with actual HTML
      Object.entries(content.links).forEach(([key, linkData]) => {
        const placeholder = `{${key}}`
        const icon = linkData.icon ? `<span class="mr-1.5 inline-flex items-center">${linkData.icon}</span>` : ''
        const linkHtml = `<a href="${linkData.url}" class="custom-underline inline-flex items-center" target="_blank" rel="noopener noreferrer">${icon}${linkData.text}</a>`
        html = html.replace(placeholder, linkHtml)
      })
      
      element.innerHTML = html
    }
  }
  
  // Populate hero intro
  setText('[data-content="hero.intro.text1"]', siteContent.hero?.intro?.text1)
  setRichText('[data-content="hero.intro.text2"]', siteContent.hero?.intro?.text2)
  setText('[data-content="hero.intro.text3"]', siteContent.hero?.intro?.text3)
  

  
  // Populate talks section
  const talksContainer = document.querySelector('#talks-container')
  if (talksContainer && siteContent.talks) {
    talksContainer.innerHTML = siteContent.talks.map(talk => `
      <section class="px-10 pt-10 pb-16 md:pb-24 talk-section">
        <div class="max-w-content space-y-8">
          <div class="space-y-4">
            <!-- Talk Header -->
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full border border-primary-500 flex items-center justify-center">
                <span class="font-arial text-[20px] leading-[1.1] text-primary-500 uppercase">${talk.id}</span>
              </div>
              <h2 class="flex-1 min-w-0">
                <a href="#" class="talk-title-link font-times text-[28px] leading-[1.3] text-primary-500 underline decoration-solid underline-offset-[4px] decoration-skip-ink-none cursor-pointer talk-action-btn" 
                   data-talk-id="${talk.id}"
                   data-action="primary">${talk.title}</a>
              </h2>
            </div>
            
            <!-- Talk Description -->
            <p class="font-times text-[28px] leading-[1.3] text-black">${talk.description}</p>
          </div>
          
          <!-- Tags -->
          <div class="flex gap-4 items-center">
            ${talk.tags ? talk.tags.map(tag => `
              <span class="relative font-arial text-[18px] leading-[1.4] text-gray-500 underline decoration-dotted underline-offset-[4px] cursor-help" 
                    x-data="tooltip" 
                    data-tooltip="${tag.tooltip || ''}"
                    ${tag.tooltipIcon ? `data-tooltip-icon="${tag.tooltipIcon.replace(/"/g, '&quot;')}"` : ''}>${tag.text}
                <!-- Tooltip -->
                <div x-show="show" 
                     x-ref="tooltip"
                     x-transition:enter="tooltip-enter" 
                     x-transition:enter-start="tooltip-enter" 
                     x-transition:enter-end="tooltip-enter-to"
                     x-transition:leave="tooltip-leave" 
                     x-transition:leave-start="tooltip-leave" 
                     x-transition:leave-end="tooltip-leave-to"
                     class="custom-tooltip tooltip-center"
                     :style="'left: ' + position.x + 'px; top: ' + position.y + 'px;'">
                  <div class="flex flex-col items-start gap-2">
                    <div x-show="icon" x-html="icon" class="flex-shrink-0"></div>
                    <span x-text="content" class="text-left"></span>
                  </div>
                </div>
              </span>
            `).join('') : ''}
          </div>
        </div>
      </section>
    `).join('')
  }
  
  // Populate modal content
  setText('[data-content="modal.contact.title"]', siteContent.modal?.contact?.title)
  setText('[data-content="modal.contact.description"]', siteContent.modal?.contact?.description)
  setText('[data-content="modal.contact.form.nameLabel"]', siteContent.modal?.contact?.form?.nameLabel)
  setText('[data-content="modal.contact.form.emailLabel"]', siteContent.modal?.contact?.form?.emailLabel)
  setText('[data-content="modal.contact.form.messageLabel"]', siteContent.modal?.contact?.form?.messageLabel)
  setText('[data-content="modal.contact.form.submitText"]', siteContent.modal?.contact?.form?.submitText)
  
  // Populate footer links section
  const footerLinksContainer = document.querySelector('#footer-links-container')
  if (footerLinksContainer && siteContent.footer?.links) {
    footerLinksContainer.innerHTML = siteContent.footer.links.map(link => `
      <a href="${link.url}" 
         class="font-times text-[20px] leading-[1.3] text-primary-500 underline decoration-solid underline-offset-[4px] decoration-skip-ink-none"
         target="_blank" 
         rel="noopener noreferrer">${link.text}</a>
    `).join('')
  }
  
  // Update image carousel with loaded content
  updateImageCarousel()
}

function updateImageCarousel() {
  // Trigger a custom event that the carousel can listen to
  window.dispatchEvent(new CustomEvent('contentLoaded', { 
    detail: { images: siteContent.images } 
  }))
  console.log('Dispatched contentLoaded event with images:', siteContent.images)
}

// Alpine.js store for modal
Alpine.store('contactModal', {
  open: false,
  selectedTalk: null,
  
  openModal(talkId = null) {
    this.open = true
    this.selectedTalk = talkId
    document.body.style.overflow = 'hidden'
    
    // Reset form state when opening modal
    setTimeout(() => {
      const modalComponent = document.querySelector('[x-data*="contactModal"]')
      if (modalComponent && modalComponent._x_dataStack) {
        const data = modalComponent._x_dataStack[0]
        if (data.resetForm) {
          data.resetForm()
        }
      }
    }, 100)
    
    // Populate modal content if talkId is provided
    if (talkId && siteContent.talks) {
      this.populateModalContent(talkId)
    }
    
    // Add ESC key listener when modal opens
    document.addEventListener('keydown', this.handleEscKey)
  },
  
  closeModal() {
    this.open = false
    this.selectedTalk = null
    document.body.style.overflow = ''
    // Remove ESC key listener when modal closes
    document.removeEventListener('keydown', this.handleEscKey)
  },
  
  populateModalContent(talkId) {
    const talk = siteContent.talks.find(t => t.id === parseInt(talkId))
    if (!talk || !talk.modal) return
    
    // Update modal icon
    const iconElement = document.getElementById('modal-icon')
    if (iconElement && talk.modal.icon) {
      iconElement.innerHTML = talk.modal.icon
    }
    
    // Update modal title
    const titleElement = document.getElementById('modal-title')
    if (titleElement && talk.modal.title) {
      titleElement.textContent = talk.modal.title
    }
    
    // Update modal description
    const descriptionElement = document.getElementById('modal-description')
    if (descriptionElement && talk.modal.description) {
      descriptionElement.textContent = talk.modal.description
    }
    
    // Update modal subtitle
    const subtitleMainElement = document.getElementById('modal-subtitle-main')
    if (subtitleMainElement && talk.modal.subtitle) {
      if (typeof talk.modal.subtitle === 'string') {
        // Backward compatibility for old format
        subtitleMainElement.textContent = talk.modal.subtitle
        subtitleMainElement.removeAttribute('data-tooltip')
      } else {
        // New format with main and tooltip
        subtitleMainElement.textContent = talk.modal.subtitle.main || ''
        if (talk.modal.subtitle.tooltip) {
          subtitleMainElement.setAttribute('data-tooltip', talk.modal.subtitle.tooltip)
        }
      }
    }
    
    // Update submit icon
    const submitIconElement = document.getElementById('submit-icon')
    if (submitIconElement && siteContent.modal?.contact?.form?.submitIcon) {
      // Replace the blue color with white for the icon
      const iconHtml = siteContent.modal.contact.form.submitIcon.replace(/fill="#0D3DFF"/g, 'fill="white"')
      submitIconElement.innerHTML = iconHtml
    }
    
    // Set hidden field value
    const hiddenField = document.getElementById('selectedTalk')
    if (hiddenField) {
      hiddenField.value = `${talk.title} (ID: ${talkId})`
    }
  },
  
  handleEscKey(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      // Only close if not in submitting or success state
      const modalComponent = document.querySelector('[x-data*="contactModal"]')
      if (modalComponent && modalComponent._x_dataStack) {
        const data = modalComponent._x_dataStack[0]
        if (!data.submitting && !data.success) {
          Alpine.store('contactModal').closeModal()
        }
      }
    }
  }
})

// Alpine.js components
Alpine.data('contactModal', () => ({
  submitting: false,
  success: false,
  
  closeModal() {
    // Only allow closing if not in submitting or success state
    if (!this.submitting && !this.success) {
      Alpine.store('contactModal').closeModal()
    }
  },
  
  resetForm() {
    this.submitting = false
    this.success = false
    
    // Reset form field values
    const form = document.querySelector('form')
    if (form) {
      form.reset()
    }
  },
  
  async submitForm(event) {
    event.preventDefault()
    
    // Prevent double submission
    if (this.submitting || this.success) return
    
    // Set submitting state
    this.submitting = true
    
    // Get form data
    const formData = new FormData(event.target)
    const selectedTalk = formData.get('selectedTalk')
    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    
    try {
      // Send to your Vercel serverless function
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          selectedTalk
        })
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', response)
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      console.log('Email sent successfully:', result.messageId)

      // Set success state
      this.submitting = false
      this.success = true
      
      // Show success state for 1 second, then close modal
      setTimeout(() => {
        Alpine.store('contactModal').closeModal()
        // Reset form state after modal close animation
        setTimeout(() => {
          this.resetForm()
        }, 300)
      }, 1000)

    } catch (error) {
      console.error('Form submission error:', error)
      this.submitting = false
      
      // Show error message to user
      alert(`Sorry, there was an error sending your message: ${error.message}. Please try again or contact me directly.`)
    }
  }
}))

// Tooltip Component
Alpine.data('tooltip', () => ({
  show: false,
  content: '',
  icon: '',
  position: { x: 0, y: 0 },
  alignment: 'center',
  
  init() {
    // Bind methods to maintain context
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    
    // Add event listeners
    this.$el.addEventListener('mouseenter', this.handleMouseEnter)
    this.$el.addEventListener('mouseleave', this.handleMouseLeave)
    this.$el.addEventListener('mousemove', this.handleMouseMove)
  },
  
  handleMouseEnter(event) {
    console.log('Tooltip mouseenter triggered on:', this.$el)
    const tooltipContent = this.$el.getAttribute('data-tooltip')
    console.log('Tooltip content:', tooltipContent)
    if (!tooltipContent) return
    
    const tooltipIcon = this.$el.getAttribute('data-tooltip-icon')
    
    this.content = tooltipContent
    this.icon = tooltipIcon || ''
    this.updatePosition(event)
    this.show = true
    console.log('Tooltip should now show:', this.show)
  },
  
  handleMouseLeave() {
    this.show = false
  },
  
  handleMouseMove(event) {
    if (this.show) {
      this.updatePosition(event)
    }
  },
  
  updatePosition(event) {
    const rect = this.$el.getBoundingClientRect()
    const tooltipEl = this.$refs.tooltip
    
    if (!tooltipEl) return
    
    // Get tooltip dimensions by temporarily showing it
    const originalDisplay = tooltipEl.style.display
    const originalVisibility = tooltipEl.style.visibility
    tooltipEl.style.display = 'block'
    tooltipEl.style.visibility = 'hidden'
    tooltipEl.style.position = 'fixed'
    tooltipEl.style.left = '0'
    tooltipEl.style.top = '0'
    
    const tooltipWidth = tooltipEl.offsetWidth
    const tooltipHeight = tooltipEl.offsetHeight
    
    // Restore original styles
    tooltipEl.style.display = originalDisplay
    tooltipEl.style.visibility = originalVisibility
    
    // Calculate positions
    const elementCenterX = rect.left + rect.width / 2
    const viewportWidth = window.innerWidth
    const padding = 16 // Distance from viewport edge
    
    let x, alignment
    
    // Determine horizontal alignment based on available space
    const spaceLeft = elementCenterX
    const spaceRight = viewportWidth - elementCenterX
    const halfTooltipWidth = tooltipWidth / 2
    
    if (spaceLeft >= halfTooltipWidth + padding && spaceRight >= halfTooltipWidth + padding) {
      // Enough space for center alignment
      alignment = 'center'
      x = elementCenterX
    } else if (spaceLeft < halfTooltipWidth + padding) {
      // Not enough space on left, align to left edge
      alignment = 'left'
      x = rect.left
      // Ensure tooltip doesn't go off left edge
      if (x < padding) {
        x = padding
      }
    } else {
      // Not enough space on right, align to right edge
      alignment = 'right'
      x = rect.right
      // Ensure tooltip doesn't go off right edge
      if (x + tooltipWidth > viewportWidth - padding) {
        x = viewportWidth - padding
      }
    }
    
    // Calculate vertical position
    let y = rect.top - tooltipHeight - 8 // 8px gap above element
    
    // Vertical adjustment - if not enough space above, show below
    if (y < padding) {
      y = rect.bottom + 8
    }
    
    // Update tooltip alignment class
    this.updateTooltipAlignment(tooltipEl, alignment)
    
    console.log(`Tooltip alignment: ${alignment}, position: (${x}, ${y}), element center: ${elementCenterX}`)
    
    this.position = { x, y }
    this.alignment = alignment
  },
  
  updateTooltipAlignment(tooltipEl, alignment) {
    // Remove existing alignment classes
    tooltipEl.classList.remove('tooltip-center', 'tooltip-left', 'tooltip-right')
    // Add new alignment class
    tooltipEl.classList.add(`tooltip-${alignment}`)
  },
  
  destroy() {
    this.$el.removeEventListener('mouseenter', this.handleMouseEnter)
    this.$el.removeEventListener('mouseleave', this.handleMouseLeave)
    this.$el.removeEventListener('mousemove', this.handleMouseMove)
  }
}))

Alpine.data('navigation', () => ({
  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}))

// Image Carousel Component
Alpine.data('imageCarousel', () => ({
  currentIndex: 0,
  images: [],
  intervalId: null,
  
  init() {
    // Load images from content (might be empty initially)
    this.images = siteContent.images || []
    
    // Listen for content loaded event
    window.addEventListener('contentLoaded', (event) => {
      console.log('Carousel received contentLoaded event:', event.detail.images)
      this.images = event.detail.images
    })
    
    // Start auto-rotation
    this.startAutoRotation()
  },
  
  startAutoRotation() {
    this.intervalId = setInterval(() => {
      this.nextSlide()
    }, 4000) // 4 second delay
  },
  
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length
  },
  

  
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}))

// Add click handlers for talk action buttons
document.addEventListener('click', function(e) {
  if (e.target.matches('.talk-action-btn') || e.target.closest('.talk-action-btn')) {
    e.preventDefault() // Prevent default anchor behavior that scrolls to top
    const button = e.target.matches('.talk-action-btn') ? e.target : e.target.closest('.talk-action-btn')
    const talkId = button.getAttribute('data-talk-id')
    const action = button.getAttribute('data-action')
    
    console.log(`Clicked talk ${talkId} action: ${action} (${button.textContent.trim()})`)
    
    // Check if Alpine store is available
    if (window.Alpine && Alpine.store && Alpine.store('contactModal')) {
      console.log('Opening modal via Alpine store')
      Alpine.store('contactModal').openModal(talkId)
    } else {
      console.error('Alpine store not available')
    }
  }
})

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Start Alpine first
  Alpine.start()
  
  // Make Alpine available globally for debugging
  window.Alpine = Alpine
  
  // Then load content
  loadContent()
  
  // Debug: Check if store is available
  setTimeout(() => {
    console.log('Alpine store check:', Alpine.store('contactModal'))
    
    // Force Alpine to process any missed elements
    const availabilityTooltip = document.querySelector('[data-content="hero.availability.text"]')
    if (availabilityTooltip) {
      console.log('Found availability tooltip element:', availabilityTooltip)
      console.log('Has x-data:', availabilityTooltip.getAttribute('x-data'))
      console.log('Has data-tooltip:', availabilityTooltip.getAttribute('data-tooltip'))
    }
  }, 100)
}) 