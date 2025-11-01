# Lesson Viewing Page Implementation

## Overview
Trang xem bài học (Lesson Viewing Page) cho phép học viên xem video bài học, theo dõi tiến độ, ghi chú, và tương tác với nội dung khóa học. Giao diện được thiết kế với video player đầy đủ tính năng và sidebar curriculum để điều hướng giữa các bài học.

## Page Structure

### Route
- **Path**: `/courses/[slug]/learn/[lessonId]`
- **Type**: Dynamic route với 2 params (course slug và lesson ID)
- **Layout**: Full-screen layout không có header/footer chính

### Main Components

#### 1. **LessonView Component** (`lesson-view.tsx`)
Component chính quản lý toàn bộ giao diện xem bài học.

**Features:**
- Top navigation bar với nút back về trang course detail
- Video player toàn màn hình
- Tabbed content (Overview, Notes, Announcements, Reviews)
- Sidebar curriculum có thể toggle (responsive)
- State management cho active tab và sidebar visibility

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Top Navigation (Back to Course | Course Title)         │
├─────────────────────────────────────┬───────────────────┤
│                                     │                   │
│  Video Player                       │   Sidebar         │
│  (Full width when sidebar closed)   │   - Progress      │
│                                     │   - Curriculum    │
├─────────────────────────────────────┤   - Lessons       │
│  Tabs (Overview/Notes/etc)          │                   │
│                                     │                   │
│  Tab Content                        │                   │
│                                     │                   │
└─────────────────────────────────────┴───────────────────┘
```

#### 2. **VideoPlayer Component** (`video-player.tsx`)
Custom video player với đầy đủ controls.

**Features:**
- ✅ Play/Pause toggle
- ✅ Progress bar với seek functionality
- ✅ Volume control với mute button
- ✅ Playback speed control (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- ✅ Fullscreen mode
- ✅ Skip forward/backward (10 seconds)
- ✅ Time display (current/total)
- ✅ Auto-hide controls khi idle
- ✅ Progress tracking callback
- ✅ Completion callback

**Controls:**
- Top: Video title
- Center: Large play button (khi paused)
- Bottom: Progress bar, play controls, volume, time, settings, fullscreen

#### 3. **LessonSidebar Component** (`lesson-sidebar.tsx`)
Sidebar hiển thị curriculum và progress tracking.

**Features:**
- Overall progress bar (% complete)
- Lesson count (completed/total)
- Expandable sections
- Lesson list với:
  - Icon theo type (video/quiz/assignment/reading)
  - Completion status (checkmark)
  - Lock icon cho locked lessons
  - Duration display
  - Preview badge
  - Active lesson highlight (orange border)
- Click vào lesson để navigate

**Lesson Types:**
- 🎬 Video (PlayCircle icon)
- 📝 Quiz (ClipboardList icon)
- 📄 Assignment (FileText icon)
- 📖 Reading (BookOpen icon)
- ✅ Completed (CheckCircle icon - green)

#### 4. **LessonTabs Component** (`lesson-tabs.tsx`)
Tab navigation cho content bên dưới video.

**Tabs:**
1. **Overview** - Thông tin về bài học
2. **Notes** - Ghi chú của học viên
3. **Announcements** - Thông báo từ instructor
4. **Reviews** - Đánh giá khóa học

**Styling:**
- Active tab: Orange color với underline
- Inactive: Muted color với hover effect

### Tab Content Components

#### 5. **LessonOverviewTab** (`lesson-overview-tab.tsx`)
**Content:**
- Lesson description
- Course overview (context)
- Lesson details grid:
  - Type (video/quiz/etc)
  - Duration
  - Status (completed/in progress)
  - Access level (preview/full)

#### 6. **LessonNotesTab** (`lesson-notes-tab.tsx`)
**Features:**
- Add new note form với timestamp
- Notes list hiển thị:
  - Timestamp badge (orange)
  - Creation date
  - Note content
  - Delete button
- Empty state khi chưa có notes

**Note Structure:**
```typescript
interface Note {
  id: number;
  timestamp: string;  // e.g., "05:30"
  content: string;
  createdAt: Date;
}
```

#### 7. **LessonAnnouncementsTab** (`lesson-announcements-tab.tsx`)
**Features:**
- List of course announcements
- Each announcement shows:
  - Title với "NEW" badge (nếu mới)
  - Author name với icon
  - Date posted (với time ago format)
  - Content text
- Empty state

**Announcement Structure:**
```typescript
interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  isNew: boolean;
}
```

#### 8. **LessonReviewsTab** (`lesson-reviews-tab.tsx`)
**Features:**
- Rating overview:
  - Average rating (large number)
  - Star display
  - Total review count
  - Rating distribution (5-1 stars với progress bars)
- Individual reviews list:
  - User avatar
  - Name và date
  - Star rating
  - Review content

## Data Schema

### Lesson Schema (`lesson.schema.ts`)

```typescript
// Lesson Item (video, quiz, assignment, reading)
interface LessonItemType {
  id: number;
  title: string;
  duration: string;
  type: "video" | "quiz" | "assignment" | "reading";
  isPreview: boolean;
  isCompleted: boolean;
  videoUrl?: string;
  content?: string;
}

// Section (group of lessons)
interface SectionType {
  id: number;
  title: string;
  lessons: LessonItemType[];
}

// Course Curriculum (full structure)
interface CourseCurriculumType {
  courseId: number;
  sections: SectionType[];
  totalDuration: string;
  totalLessons: number;
}
```

## Mock Data

### Sample Curriculum (`mockData.ts`)
- Course ID: 1
- Total: 3 sections, 12 lessons
- Sections:
  1. **Introduction to LearnPress** (4 lessons)
     - Welcome to the Course (video, 05:30, preview)
     - Course Overview (video, 08:45, preview)
     - Setting Up Environment (video, 12:20)
     - Quiz: Getting Started (quiz, 10:00)
  
  2. **Core Concepts** (4 lessons)
     - Understanding Architecture (video, 15:30)
     - Creating First Course (video, 20:15)
     - Managing Lessons (video, 18:40)
     - Assignment: Build Sample (assignment, 30:00)
  
  3. **Advanced Features** (4 lessons)
     - Custom Templates (video, 22:10)
     - Payment Integration (video, 25:30)
     - Analytics (video, 16:45)
     - Final Quiz (quiz, 15:00)

## File Structure

```
src/
├── app/(client)/(main)/courses/[slug]/
│   ├── learn/[lessonId]/
│   │   ├── page.tsx                    # Main lesson page
│   │   └── _components/
│   │       ├── index.ts
│   │       └── lesson-view.tsx         # Main view component
│   └── _components/
│       └── course-hero.tsx             # Updated with Start Now link
├── components/custom/
│   ├── video-player.tsx                # Video player component
│   ├── lesson-sidebar.tsx              # Curriculum sidebar
│   ├── lesson-tabs.tsx                 # Tab navigation
│   ├── lesson-overview-tab.tsx         # Overview tab content
│   ├── lesson-notes-tab.tsx            # Notes tab content
│   ├── lesson-announcements-tab.tsx    # Announcements tab content
│   └── lesson-reviews-tab.tsx          # Reviews tab content
├── schema/
│   └── lesson.schema.ts                # Lesson data schemas
└── lib/
    └── mockData.ts                     # Mock curriculum data
```

## Key Features

### ✅ Video Player
- Full custom controls
- Progress tracking
- Playback speed control
- Keyboard shortcuts ready
- Fullscreen support
- Auto-hide controls

### ✅ Navigation
- Easy back to course detail
- Sidebar curriculum navigation
- Next/previous lesson (via sidebar)
- Lock system for sequential learning

### ✅ Progress Tracking
- Visual progress bar
- Completed lesson markers
- Overall course completion percentage
- Lesson-level completion status

### ✅ Student Engagement
- Notes with timestamps
- Course announcements
- Review display
- Multiple content formats (video/quiz/assignment)

### ✅ Responsive Design
- Sidebar toggle on mobile
- Adaptive video player
- Responsive layout

## Styling System

**Color Tokens:**
- `--color-orange`: Primary action color (#ff8e3c)
- `--color-green`: Success/completed (#00a76f)
- `--color-star`: Rating stars (#eac700)
- `--color-muted-foreground`: Secondary text

**Typography:**
- Headings: `font-heading` class (Exo font)
- Body: Jost font (default)

## Integration Points

### Backend Integration (To Do)
1. **Video Progress:**
   - Save progress via `onProgress` callback
   - Resume from last position
   
2. **Lesson Completion:**
   - Mark complete via `onComplete` callback
   - Update curriculum state
   
3. **Notes:**
   - CRUD operations for user notes
   - Sync with video timestamp
   
4. **Real-time Updates:**
   - New announcements notification
   - Progress sync across devices

### API Endpoints Needed
```typescript
// Progress tracking
POST /api/courses/:courseId/lessons/:lessonId/progress
{ progress: number, timestamp: number }

// Mark complete
POST /api/courses/:courseId/lessons/:lessonId/complete

// Notes CRUD
GET    /api/courses/:courseId/lessons/:lessonId/notes
POST   /api/courses/:courseId/lessons/:lessonId/notes
DELETE /api/notes/:noteId

// Announcements
GET /api/courses/:courseId/announcements

// Reviews (already implemented)
GET /api/courses/:courseId/reviews
```

## Navigation Flow

1. **Course Detail Page** (`/courses/[slug]`)
   - Click "Start Now" button
   - Redirects to first lesson

2. **Lesson Page** (`/courses/[slug]/learn/[lessonId]`)
   - Watch video
   - Take notes
   - Navigate via sidebar
   - Complete lesson
   - Move to next lesson

3. **Back to Course**
   - Click "Back to Course" button
   - Returns to course detail page

## Testing URLs

With mock data:
- `/courses/learn-ay-lms-website-with-learnpress/learn/1` - First lesson (Welcome)
- `/courses/learn-ay-lms-website-with-learnpress/learn/2` - Second lesson (Overview)
- `/courses/learn-ay-lms-website-with-learnpress/learn/5` - Section 2 first lesson

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Performance Considerations

1. **Video Loading:**
   - Use video CDN (Cloudinary)
   - Lazy load video
   - Preload metadata only

2. **Sidebar Performance:**
   - Virtualize long lesson lists (if needed)
   - Collapse sections by default
   - Expand only active section

3. **State Management:**
   - Local state for UI (tabs, sidebar)
   - Server state for progress (to implement)

## Future Enhancements

1. **Video Features:**
   - Quality selector (720p, 1080p, etc)
   - Subtitles/captions support
   - Picture-in-picture mode
   - Download for offline viewing

2. **Learning Features:**
   - Quiz integration in player
   - Interactive assignments
   - Discussion forum per lesson
   - Bookmarks/favorites

3. **Social Features:**
   - Share note with class
   - Study groups
   - Ask instructor questions
   - Live Q&A sessions

4. **Analytics:**
   - Watch time tracking
   - Engagement metrics
   - Completion predictions
   - Personalized recommendations

## Accessibility

- ✅ Keyboard navigation for video controls
- ✅ ARIA labels on buttons
- ✅ Focus states on interactive elements
- ✅ Semantic HTML structure
- 🔄 Screen reader support (to enhance)
- 🔄 Closed captions (to implement)

## Conclusion

Trang xem bài học đã được implement đầy đủ với:
- ✅ Custom video player với controls hoàn chỉnh
- ✅ Sidebar curriculum với progress tracking
- ✅ 4 tab content (Overview, Notes, Announcements, Reviews)
- ✅ Responsive design
- ✅ Navigation integration
- ✅ Mock data đầy đủ

Sẵn sàng để test và integrate với backend API!
