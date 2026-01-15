/**
 * Navbar mega menu animation controller
 * Handles directional animations when switching between dropdowns
 */

interface DropdownState {
  current: string | null;
  previous: string | null;
}

export class NavbarAnimationController {
  private state: DropdownState = {
    current: null,
    previous: null,
  };

  private dropdownOrder = ['products', 'solutions', 'resources', 'company'];

  /**
   * Initialize the navbar animation controller
   */
  init(): void {
    const toggles = [
      { element: document.querySelector('[dev-target="products-toggle"]'), name: 'products' },
      { element: document.querySelector('[dev-target="solutions-toggle"]'), name: 'solutions' },
      { element: document.querySelector('[dev-target="resources-toggle"]'), name: 'resources' },
      { element: document.querySelector('[dev-target="company-toggle"]'), name: 'company' },
    ];

    toggles.forEach(({ element: toggle, name: dropdownName }) => {
      if (!toggle) {
        console.error(`Toggle not found for ${dropdownName}`);
        return;
      }

      // Find the parent dropdown
      const dropdown = toggle.closest('.nav_menu-dropdown');
      if (!dropdown) {
        console.error(`Dropdown container not found for ${dropdownName}`);
        return;
      }

      // Find the content element within THIS specific dropdown
      const content = dropdown.querySelector('.nav_dropdown-content, .navbar_dropdown-content');
      if (!content) {
        console.error(`Dropdown content not found for ${dropdownName}`);
        return;
      }

      // Track mouse enter on the toggle itself
      toggle.addEventListener('mouseenter', () => {
        this.handleDropdownEnter(dropdownName, content as HTMLElement);
      });

      // Track when leaving the entire dropdown area
      dropdown.addEventListener('mouseleave', () => {
        this.handleDropdownLeave(dropdownName);
      });
    });
  }

  /**
   * Handle dropdown enter event
   */
  private handleDropdownEnter(dropdownName: string, contentElement: HTMLElement): void {
    const direction = this.getAnimationDirection(dropdownName);

    // Remove any existing animation classes
    contentElement.classList.remove(
      'slide-from-left',
      'slide-from-right',
      'slide-out-left',
      'slide-out-right'
    );

    // Add the appropriate animation class
    if (direction === 'left') {
      contentElement.classList.add('slide-from-left');
    } else if (direction === 'right') {
      contentElement.classList.add('slide-from-right');
    }

    // Update state
    this.state.previous = this.state.current;
    this.state.current = dropdownName;
    console.log(`Entered ${dropdownName} from ${this.state.previous} direction: ${direction}`);
  }

  /**
   * Handle dropdown leave event
   */
  private handleDropdownLeave(dropdownName: string): void {
    // Clear current state when leaving a dropdown completely
    if (this.state.current === dropdownName) {
      this.state.previous = this.state.current;
      this.state.current = null;
    }
  }

  /**
   * Determine animation direction based on dropdown order
   */
  private getAnimationDirection(currentDropdown: string): 'left' | 'right' | 'none' {
    if (!this.state.previous) return 'none';

    const currentIndex = this.dropdownOrder.indexOf(currentDropdown);
    const previousIndex = this.dropdownOrder.indexOf(this.state.previous);

    if (currentIndex > previousIndex) {
      return 'right'; // Moving right, slide from right
    }
    if (currentIndex < previousIndex) {
      return 'left'; // Moving left, slide from left
    }

    return 'none';
  }

  /**
   * Reset the animation state
   */
  reset(): void {
    this.state = {
      current: null,
      previous: null,
    };
  }
}
