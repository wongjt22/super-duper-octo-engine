# Interactive Wikipedia Landmarks Map - Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from Google Maps and Apple Maps for familiarity, with Wikipedia's clean information architecture for content presentation.

## Core Design Elements

### Color Palette
- **Primary**: hsl(0, 0%, 15%) - Dark charcoal for text/UI
- **Secondary**: hsl(0, 0%, 45%) - Medium gray for secondary text
- **Tertiary**: hsl(0, 0%, 70%) - Light gray for subtle elements
- **Background**: hsl(0, 0%, 98%) - Off-white main background
- **Accent**: hsl(210, 15%, 25%) - Dark blue-gray for interactive elements
- **Surface**: hsl(0, 0%, 100%) - Pure white for cards/panels

### Typography
- **Primary**: Inter or system fonts
- **Sizes**: 32px (headings), 16px (body), 14px (captions), 12px (labels)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold)

### Layout System
- **Full-screen map** with floating UI elements
- **Grid**: 8px base unit for consistent spacing
- **Breakpoints**: Mobile-first responsive design
- **Z-index layers**: Map (0), markers (10), panels (20), overlays (30)

### Component Library

**Map Interface**
- Clean, borderless map container
- Zoom controls: Minimal floating buttons (bottom-right)
- Search bar: Floating at top with subtle shadow

**Landmark Markers**
- Custom Wikipedia "W" icon in circles
- Two sizes: Default (24px), clustered (32px)
- Hover state: Subtle scale increase (1.1x)
- Active state: Highlighted with accent color

**Information Panels**
- Floating cards with rounded-md borders
- White background with subtle border: hsl(0, 0%, 90%)
- 16px padding, smooth slide-in animations
- Close button: Subtle X icon (top-right)

**Sidebar (Desktop)**
- Collapsible left panel (320px width)
- Landmark list with thumbnails
- Smooth expand/collapse transitions

### Interaction Patterns
- **Loading**: Skeleton placeholders for landmark data
- **Hover**: Subtle opacity changes (0.8 → 1.0)
- **Focus**: 2px accent color outline
- **Animations**: 200ms ease-out transitions
- **Error states**: Inline messages with retry options

### Images
- **Landmark thumbnails**: 60x60px squares in list view
- **Detail images**: 280px width in information panels
- **Placeholder**: Gray rectangle with Wikipedia logo for missing images
- **Location**: Left side of list items, top of detail panels
<universal_design_guidelines>
These guidelines are universally applicable regardless of what kind of application you are building.
You are aware of these principles and apply them in every project that you complete:

<layout>
- A new element should *never* appear on hover unless that element that appears is a floating dialog or tooltip.
- If an element is hidden until some hover action occurs, then its `visibility:hidden` should be toggled as opposed to its `display:none` property. This approach prevents layout from shifting upon hover interactions.
- Elements should never change their size when hovered.
</layout>
<consistency>
- Spacing should be consistent. If you have various panels/card elements, they should all have the same padding around their inner content unless you have a justification for deviating.
- In general there should only be a few levels of spacing used: sm, md, lg. Choose a suitable value for these depending on how much space is required in the application. If it is a very information-dense application you may choose to use smaller values for all three. If the application has less information presented on any given screen, then you may choose larger values.
- The application should be opinionated about whether or not it seeks a flat design or a bordered design.
- If flat, the borders should be very subtle and only reserved to separate core UI elements such as left/top navigation bars from the rest of the page.
</consistency>
<text-color>
- The application should use three levels of text color to convey hierarchy of information:
- Default: Used for most text
- Secondary: Used for additional information
- Tertiary: Used for the least important information
- Text colors must always take into account the colors of the surface they are rendered on. Take into account both dark and light modes when solving this problem. Light text should never be rendered on a light background and darker text should never be rendered on a dark background. Double, even triple check that you have satisfied this requirement.
</text-color>
<taste>
<shadows>
- Never use drop shadows in any context
- Never use `hover:shadow-md` or any similar pattern of showing shadows on hover
- `hover:shadow-*` should never appear in any code you generate
</shadows>
<borders-and-background-colors>
- Border radii should ALWAYS be small. Always use `rounded-md` class unless you are creating a perfect circle element, or a perfect "pill" shape (both of which require that border radii be exactly half the element height).
- If there is enough contrast between the background and an element, then a border is not necessary.
- In this case, since a border is not necessary, if you do include a border, it will be one perceivable shade darker than the darkest color it touches (if in light mode) or one perceivable shade lighter than the lightest color it touches (if in dark mode).
- Some elements act as "panes", "panels" or "containers". Their only purpose is to group a set of child elements. There are three approaches to styling these "containers":
   A. Using white space and font size + headings to convey hierarchy.
   B. Using background color of the container
   C. Using borders around the container with no background-color on the container (no shadows allowed).
   D. Using a background color and border around the container.
   - Whichever method (A, B, C, D) you choose, you should strive to use the same approach consistently throughout the application design, only deviating where there is a good justification.
   - If using method B, the container background color should be very subtly "elevated" in contrast against the background it sits on top of. Just enough contrast to distinguish a boundary, but not enough to draw too much attention.
   - Method C is used when the container background color is the exact same as the background it sits on top of. In this case, the border should be very subtle.
   - If using method D, the border color should have a barely perceivable contrast to the background color of the container and the container background color should have a barely perceivable contrast against the background color it sits on top of.
   </borders-and-background-colors>
   </taste>
   <interactive-states>
   - Elements that are clickable/tappable should have the following states: - hover - active - focused
   - Elements that have a state representing "currently selected item" (for example, a set of buttons that act as a toggle between options), you should include hover, active, and focused state stylings for:
      - Scenarios where the element is not the "currently selected item".
      - Scenarios where the element is the "currently selected item".
      </interactive-states>
   <colors>
   - Never use colors. Always use grayscale for the UI.
   - Every single grayscale value should be specified for both dark and light mode. That includes colors defined for hover/active/focused states.
   </colors>
   <image-borders>
   Never forget to apply the following rule for all images:
      - In dark mode, images should have a one pixel inset drop shadow around their containers (white, mostly transparent): box-shadow: inset 0px 0px 0px 1px #FFFFFF11;
      - In light mode, images should have a one pixel inset drop shadow around their containers (black, mostly transparent): box-shadow: inset 0px 0px 0px 1px #00000011;
      - Their containers should have overflow:hidden
      </image-borders>
</universal_design_guidelines>