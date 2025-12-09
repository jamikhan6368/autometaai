# HugeIcons Setup Guide

## ✅ Fixed Implementation

### Correct HugeIcons Usage

HugeIcons requires two packages:
1. `@hugeicons/react` - The React component wrapper
2. `@hugeicons/core-free-icons` - The actual icon data

### Import Pattern

```tsx
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, FlashIcon, Image02Icon } from '@hugeicons/core-free-icons';
```

### Usage Pattern

```tsx
<HugeiconsIcon icon={SparklesIcon} size={24} className="text-white" />
```

## Icons Used in Landing Page

### Hero Section
- `SparklesIcon` - Badge icon
- `FlashIcon` - CTA button (Start Creating)
- `Image02Icon` - Explore Features button

### Navbar
- `SparklesIcon` - Logo
- `Menu01Icon` - Mobile menu open
- `Cancel01Icon` - Mobile menu close

### Features
- `FileEditIcon` - Smart Metadata Generation
- `TagsIcon` - Keyword Optimization
- `MagicWand01Icon` - Image to Prompt
- `Image02Icon` - Batch Processing
- `SparklesIcon` - Multi-Platform Support
- `Database01Icon` - Export & Organize

### How It Works
- `Upload04Icon` - Upload step
- `CpuIcon` - AI Processing step
- `Download01Icon` - Export step
- `ArrowRight01Icon` - Step connectors

### Platforms
- `Tick02Icon` - Checkmarks for all platforms

### Stats
- `Image02Icon` - Images Processed
- `UserMultiple02Icon` - Active Creators
- `Image02Icon` - Visibility Boost (reused)
- `StarIcon` - User Rating

### Pricing
- `FlashIcon` - Starter plan
- `CrownIcon` - Pro plan
- `Rocket01Icon` - Enterprise plan
- `Tick02Icon` - Feature checkmarks

### CTA
- `SparklesIcon` - Badge
- `ArrowRight01Icon` - CTA button arrow

### Footer
- `SparklesIcon` - Logo
- `TwitterIcon` - Social link
- `Github01Icon` - Social link
- `Linkedin01Icon` - Social link
- `Mail01Icon` - Social link

## Key Differences from Lucide

1. **Import Structure**: Must import from two packages
2. **Component Wrapper**: Use `HugeiconsIcon` component with `icon` prop
3. **Size Prop**: Use `size` prop instead of className width/height
4. **No strokeWidth**: HugeIcons doesn't support strokeWidth prop

## Example Component

```tsx
'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, FlashIcon } from '@hugeicons/core-free-icons';

export default function MyComponent() {
  return (
    <div>
      <HugeiconsIcon icon={SparklesIcon} size={24} className="text-blue-600" />
      <HugeiconsIcon icon={FlashIcon} size={32} className="text-white" />
    </div>
  );
}
```

## All Components Updated ✅

- ✅ Hero.tsx
- ✅ Navbar.tsx
- ✅ Features.tsx
- ✅ HowItWorks.tsx
- ✅ Platforms.tsx
- ✅ Stats.tsx
- ✅ Pricing.tsx
- ✅ CTA.tsx
- ✅ Footer.tsx
