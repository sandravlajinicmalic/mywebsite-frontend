# 🐱 SmartChat - Complete Documentation

## 📋 Overview

SmartChat is an AI-powered chatbot that exclusively talks about cats. Built with React/TypeScript on the frontend and Node.js/Express with OpenAI API on the backend, it provides an interactive chat experience where users can ask questions about cats, their behavior, health, grooming, breeds, nutrition, and everything cat-related.

---

## 🎯 Key Features

- **Cat-Only Conversations**: Strictly limited to cat-related topics
- **Multi-Language Support**: English and Serbian (srpski)
- **Text-Only Responses**: No code, images, or files - just friendly text
- **Conversation History**: Maintains context across messages
- **Real-time Chat**: Instant responses with loading indicators
- **Message Sanitization**: Input validation and output cleaning
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Visual Design**: Beautiful chat bubbles with cat-themed styling

---

## 🎨 Frontend Implementation

### 1. **Component: `SmartCat`** (`src/components/organisms/SmartCat.tsx`)

Wrapper component that provides the section layout and title for the chat feature.

#### **Structure:**
```tsx
<section>
  <div> {/* Title and subtitle */}
    <h2>{t('smartCat.title')}</h2>
    <p>{t('smartCat.subtitle')}</p>
  </div>
  <ChatBot />
</section>
```

#### **Features:**
- Responsive title with text shadow effects
- Centered layout with max-width container
- Wraps the ChatBot component

---

### 2. **Component: `ChatBot`** (`src/components/organisms/ChatBot.tsx`)

Main chat interface component that renders messages and handles user input.

#### **Layout Structure:**

**Desktop (≥ 1024px):**
- Messages section on the left (40% width)
- Cat image on the right (question.svg)
- Arrow pointing right from messages to cat

**Mobile/Tablet (< 1024px):**
- Messages section full width
- Cat image below
- Arrow pointing down from messages to cat

#### **Message Bubbles:**

**User Messages:**
- Cyan background (`#06B6D4`)
- Left-aligned
- Rounded corners with small top-left corner
- White text
- Timestamp in cyan-100

**Assistant Messages:**
- Dark gray background (`gray-800`)
- Right-aligned
- Rounded corners with large top-left corner
- White text
- Timestamp in gray-400
- Border for depth

#### **Loading Indicator:**
- Three bouncing dots animation
- Appears when waiting for AI response
- Styled as assistant message bubble

#### **Clear Button:**
- Sticky at bottom of message container
- Outline variant with pink border
- Clears conversation history

#### **Auto-Scroll:**
- Automatically scrolls to bottom when new messages arrive
- Smooth scroll behavior
- Uses `messagesContainerRef` for scroll control

#### **Custom Scrollbar:**
- Thin scrollbar (6px width)
- Gray color (`#9ca3af`)
- Transparent track
- Hover effect

---

### 3. **Hook: `useChatBot`** (`src/hooks/useChatBot.ts`)

Custom React hook that manages all chat state and logic.

#### **State Management:**
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([])
const [inputValue, setInputValue] = useState('')
const [isLoading, setIsLoading] = useState(false)
const messagesContainerRef = useRef<HTMLDivElement>(null)
```

#### **Initialization:**
- Sets welcome message on mount
- Only sets if translation is loaded (not just the key)
- Welcome message is from `t('chat.welcome')`

#### **Auto-Scroll:**
```typescript
useEffect(() => {
  scrollToBottom()
}, [messages])
```
- Scrolls to bottom whenever messages change
- Smooth scroll behavior

#### **Send Message (`handleSend`):**

**Step 1: Validation**
```typescript
if (!inputValue.trim() || isLoading) return
```

**Step 2: Create User Message**
```typescript
const userMessage: ChatMessage = {
  role: 'user',
  content: inputValue.trim(),
  timestamp: new Date()
}
```

**Step 3: Update UI**
- Add user message to state
- Clear input field
- Set loading state

**Step 4: Send to Backend**
```typescript
const response = await chatService.sendMessage(
  userMessage.content, 
  undefined, 
  language
)
```

**Step 5: Handle Response**
- Map backend response to translation if needed
- Create assistant message
- Add to messages state
- Handle errors with error message

**Step 6: Cleanup**
- Set loading to false
- Auto-scroll happens via useEffect

#### **Clear History (`handleClear`):**
```typescript
await chatService.clearHistory()
setMessages([{
  role: 'assistant',
  content: t('chat.clearMessage'),
  timestamp: new Date()
}])
```

#### **Input Handling:**

**Key Press (`handleKeyPress`):**
- Enter key sends message
- Shift+Enter allows new line (if needed in future)
- Prevents default form submission

**Input Change (`handleInputChange`):**
```typescript
const textOnly = e.target.value.replace(/[^\p{L}\p{N}\s.,!?;:'"()-]/gu, '')
setInputValue(textOnly)
```
- Allows only text characters (letters, numbers, spaces, punctuation)
- Removes special characters, emojis, code, etc.
- Unicode-aware regex for international characters

#### **Return Values:**
```typescript
return {
  messages,
  inputValue,
  isLoading,
  messagesContainerRef,
  handleSend,
  handleClear,
  handleKeyPress,
  handleInputChange,
}
```

---

### 4. **Service: `chatService`** (`src/services/chat.ts`)

API service for chat operations.

#### **Interfaces:**
```typescript
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface ChatResponse {
  response: string
  isAboutCats: boolean
}
```

#### **Methods:**

**`sendMessage(message, sessionId?, language?)`**
```typescript
async sendMessage(
  message: string, 
  sessionId?: string, 
  language?: string
): Promise<ChatResponse>
```
- Sends message to backend
- Includes session ID for conversation history
- Includes language for response language
- Returns AI response and cat-related flag

**`clearHistory(sessionId?)`**
```typescript
async clearHistory(sessionId?: string): Promise<void>
```
- Clears conversation history on backend
- Uses session ID to clear specific session

---

## 🔧 Backend Implementation

### 1. **Route: `/api/chat/message`** (`routes/chat.ts`)

POST endpoint that processes chat messages and returns AI responses.

#### **Request Body:**
```typescript
{
  message: string        // User's message
  sessionId?: string     // Optional session ID (default: 'default')
  language?: string      // Optional language (default: 'en')
}
```

#### **Response:**
```typescript
{
  response: string       // AI assistant's response
  isAboutCats: boolean   // Whether response is cat-related
}
```

#### **Processing Flow:**

**Step 1: Validation**
```typescript
if (!message || typeof message !== 'string') {
  res.status(400).json({ error: 'Message is required' })
  return
}
```

**Step 2: Sanitize Input**
```typescript
const sanitizedMessage = sanitizeMessage(message)
```
- Removes non-text characters
- Allows only letters, numbers, spaces, punctuation

**Step 3: Check for Empty Message**
```typescript
if (!finalMessage || finalMessage.length === 0) {
  res.status(400).json({ 
    error: 'Message must contain only text characters',
    response: 'Sorry, message must contain only text characters...'
  })
  return
}
```

**Step 4: Check for Non-Text Requests**
```typescript
if (isRequestingNonText(finalMessage)) {
  res.json({
    response: 'Sorry, I can only provide text responses about cats...',
    isAboutCats: false
  })
  return
}
```
- Detects requests for code, images, files
- Returns polite rejection message

**Step 5: Check if About Cats**
```typescript
if (!isAboutCats(finalMessage)) {
  res.json({
    response: 'Ask me a question about cats...',
    isAboutCats: false
  })
  return
}
```
- Validates message contains cat-related keywords
- Redirects conversation to cats if not

**Step 6: Get Conversation History**
```typescript
const session = sessionId || 'default'
let history = conversationHistory.get(session) || []
```

**Step 7: Prepare OpenAI Messages**
```typescript
const systemPrompt = getSystemPrompt(userLanguage)
const messages: ChatMessage[] = [
  { role: 'system', content: systemPrompt }
]
const recentHistory = history.slice(-10) // Last 10 messages
messages.push(...recentHistory)
```

**Step 8: Call OpenAI API**
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages as any,
  temperature: 0.7,
  max_tokens: 500,
})
```

**Step 9: Sanitize Response**
```typescript
const sanitizedResponse = sanitizeResponse(assistantResponse)
```
- Removes code blocks
- Removes markdown formatting
- Ensures text-only output

**Step 10: Update History**
```typescript
history.push({ role: 'user', content: finalMessage })
history.push({ role: 'assistant', content: assistantResponse })
if (history.length > 20) {
  history = history.slice(-20) // Keep last 20 messages
}
conversationHistory.set(session, history)
```

**Step 11: Return Response**
```typescript
res.json({
  response: assistantResponse,
  isAboutCats: true
})
```

---

### 2. **Route: `/api/chat/clear`** (`routes/chat.ts`)

POST endpoint that clears conversation history.

#### **Request Body:**
```typescript
{
  sessionId?: string  // Optional session ID (default: 'default')
}
```

#### **Response:**
```typescript
{
  success: boolean
  message: string
}
```

#### **Implementation:**
```typescript
router.post('/clear', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body
    const session = sessionId || 'default'
    conversationHistory.delete(session)
    res.json({ success: true, message: 'Conversation history cleared' })
  } catch (error) {
    res.status(500).json({ error: 'Error clearing history' })
  }
})
```

---

### 3. **Helper Functions**

#### **`getSystemPrompt(language)`**

Generates system prompt based on language.

**English:**
```
You are a friendly AI assistant that talks ONLY about cats.
Your role is to help people learn more about cats...
```

**Serbian:**
```
Ti si prijateljski AI asistent koji razgovara SAMO o mačkama.
Tvoja uloga je da pomažeš ljudima da saznaju više o mačkama...
```

#### **`sanitizeMessage(message)`**

Removes non-text characters from input.

```typescript
function sanitizeMessage(message: string): string {
  return message.replace(/[^\p{L}\p{N}\s.,!?;:'"()-]/gu, '')
}
```

#### **`isRequestingNonText(message)`**

Checks if message requests code, images, or files.

**Keywords Detected:**
- Code: `'write code'`, `'generate code'`, `'javascript'`, `'python'`, etc.
- Images: `'generate image'`, `'create image'`, `'dall-e'`, etc.
- Files: `'generate file'`, `'create file'`, etc.

#### **`sanitizeResponse(response)`**

Cleans AI response to ensure text-only.

**Removes:**
- Code blocks (```code```)
- Inline code (`code`)
- Markdown links `[text](url)`
- Markdown bold/italic `**text**`, `*text*`
- Special formatting characters

#### **`isAboutCats(message)`**

Checks if message contains cat-related keywords.

**Keywords:**
- Serbian: `'mačka'`, `'mačke'`, `'mačak'`, `'mačić'`, `'mjau'`, etc.
- English: `'cat'`, `'cats'`, `'kitten'`, `'feline'`, `'meow'`, etc.

---

## 🔄 Data Flow

```
1. User types message in input field
   ↓
2. Frontend: Input sanitization (text-only characters)
   ↓
3. User clicks "Send" or presses Enter
   ↓
4. Frontend: Creates user message object
   ↓
5. Frontend: Adds user message to state (optimistic update)
   ↓
6. Frontend: Calls chatService.sendMessage()
   ↓
7. Backend: Validates message
   ↓
8. Backend: Sanitizes message (removes non-text)
   ↓
9. Backend: Checks if requesting non-text content
   ↓
10. Backend: Checks if message is about cats
    ↓
11. Backend: Gets conversation history for session
    ↓
12. Backend: Prepares messages for OpenAI (system prompt + history)
    ↓
13. Backend: Calls OpenAI API (gpt-4o-mini)
    ↓
14. Backend: Sanitizes AI response (removes code blocks, markdown)
    ↓
15. Backend: Updates conversation history
    ↓
16. Backend: Returns response to frontend
    ↓
17. Frontend: Maps response to translation if needed
    ↓
18. Frontend: Creates assistant message object
    ↓
19. Frontend: Adds assistant message to state
    ↓
20. Frontend: Auto-scrolls to bottom
    ↓
21. User sees response in chat
```

---

## 🎨 UI/UX Features

### **Message Bubbles:**
- **User messages**: Cyan background, left-aligned
- **Assistant messages**: Dark gray background, right-aligned
- **Timestamps**: Small text below each message
- **Rounded corners**: Different styles for user vs assistant

### **Loading State:**
- Three bouncing dots animation
- Appears as assistant message bubble
- Shows while waiting for AI response

### **Responsive Design:**
- **Desktop**: Side-by-side layout (messages left, cat right)
- **Mobile/Tablet**: Stacked layout (messages top, cat bottom)
- **Arrows**: Visual connection between messages and cat
  - Desktop: Right-pointing arrow
  - Mobile: Down-pointing arrow

### **Input Field:**
- White background variant
- Text-only input (special characters removed)
- Disabled during loading
- Enter key to send

### **Clear Button:**
- Sticky at bottom of message container
- Pink border (brand color)
- Clears conversation history

---

## 🌐 Internationalization

### **Translation Keys:**

**English (`en.json`):**
```json
{
  "smartCat.title": "SmartChat",
  "smartCat.subtitle": "Ask me anything about cats!",
  "chat.placeholder": "Type your question about cats...",
  "chat.send": "Send",
  "chat.sending": "Sending...",
  "chat.clear": "Clear",
  "chat.welcome": "Hello! I'm your cat expert. Ask me anything about cats! 😸",
  "chat.clearMessage": "Conversation cleared. Ask me anything about cats!",
  "chat.catAlt": "Question mark cat"
}
```

**Serbian (`sr.json`):**
```json
{
  "smartCat.title": "SmartChat",
  "smartCat.subtitle": "Pitaj me bilo šta o mačkama!",
  "chat.placeholder": "Unesi svoje pitanje o mačkama...",
  "chat.send": "Pošalji",
  "chat.sending": "Šalje se...",
  "chat.clear": "Obriši",
  "chat.welcome": "Zdravo! Ja sam tvoj ekspert za mačke. Pitaj me bilo šta o mačkama! 😸",
  "chat.clearMessage": "Razgovor obrisan. Pitaj me bilo šta o mačkama!",
  "chat.catAlt": "Mačka sa znakom pitanja"
}
```

---

## ⚙️ Configuration

### **OpenAI API:**
- **Model**: `gpt-4o-mini` (cost-effective, fast)
- **Temperature**: `0.7` (balanced creativity)
- **Max Tokens**: `500` (concise responses)
- **System Prompt**: Language-specific, cat-only restriction

### **Conversation History:**
- **Storage**: In-memory Map (session-based)
- **Limit**: Last 20 messages per session
- **Context**: Last 10 messages sent to OpenAI
- **Session ID**: Defaults to `'default'` if not provided

### **Message Limits:**
- **Input**: Text-only (letters, numbers, spaces, punctuation)
- **Output**: Text-only (code blocks, markdown removed)
- **Length**: No explicit limit (handled by OpenAI max_tokens)

---

## 🔒 Security & Validation

### **Input Validation:**
- Type checking (must be string)
- Empty message check
- Text-only character filtering
- Non-text request detection

### **Output Sanitization:**
- Code block removal
- Markdown removal
- Special character removal
- Empty response fallback

### **Error Handling:**
- API errors caught and handled
- Fallback responses provided
- User-friendly error messages
- Console logging for debugging

---

## 📁 File Structure

### **Frontend:**
```
mywebsite-frontend/
├── src/
│   ├── components/
│   │   └── organisms/
│   │       ├── SmartCat.tsx          # Wrapper component
│   │       └── ChatBot.tsx           # Main chat component
│   ├── hooks/
│   │   └── useChatBot.ts             # Chat logic hook
│   ├── services/
│   │   └── chat.ts                   # API service
│   └── constants/
│       └── index.ts                  # API endpoints
└── public/
    └── translations/
        ├── en.json                   # English translations
        └── sr.json                   # Serbian translations
```

### **Backend:**
```
mywebsite-backend/
├── routes/
│   └── chat.ts                       # Chat endpoints
└── .env                              # OpenAI API key
```

---

## 🚀 API Endpoints

### **POST `/api/chat/message`**
- **Auth**: Not required (public endpoint)
- **Body**: `{ message: string, sessionId?: string, language?: string }`
- **Response**: `{ response: string, isAboutCats: boolean }`
- **Errors**: 400 (invalid message), 500 (server error)

### **POST `/api/chat/clear`**
- **Auth**: Not required (public endpoint)
- **Body**: `{ sessionId?: string }`
- **Response**: `{ success: boolean, message: string }`
- **Errors**: 500 (server error)

---

## 🐛 Error Handling

### **Frontend Errors:**
- Network errors: Shows error message in chat
- API errors: Displays user-friendly error
- Input errors: Prevented by validation

### **Backend Errors:**
- OpenAI API errors: Fallback response
- Validation errors: 400 with error message
- Server errors: 500 with generic message

### **Error Messages:**
- Translated based on user language
- User-friendly (no technical details)
- Actionable (suggests what to do)

---

## 🔮 Future Enhancements

Potential improvements:
- Persistent conversation history (database storage)
- User-specific conversation history
- More languages support
- Voice input/output
- Cat emoji reactions
- Conversation export
- Favorite questions
- Cat breed image suggestions (text-only links)
- Cat care tips database
- Conversation analytics
- Rate limiting per user
- Admin panel for monitoring

---

## 📝 Important Notes

### **Cat-Only Restriction:**
- Strictly enforced on backend
- System prompt enforces restriction
- Keyword detection for validation
- Polite redirection if off-topic

### **Text-Only Responses:**
- No code generation
- No image generation
- No file generation
- Markdown removed from responses

### **Conversation History:**
- Stored in-memory (lost on server restart)
- Session-based (one history per session)
- Limited to 20 messages
- Last 10 sent to OpenAI for context

### **Language Support:**
- English (default)
- Serbian (srpski)
- System prompt adapts to language
- Responses in requested language

### **Performance:**
- Uses `gpt-4o-mini` for speed and cost
- Max 500 tokens for quick responses
- Limited history for faster processing
- Optimistic UI updates

---

## 🧪 Testing

### **Manual Testing Checklist:**
- [ ] Send cat-related question
- [ ] Send non-cat question (should redirect)
- [ ] Send code request (should reject)
- [ ] Send image request (should reject)
- [ ] Test in English
- [ ] Test in Serbian
- [ ] Clear conversation history
- [ ] Test on mobile
- [ ] Test on desktop
- [ ] Test auto-scroll
- [ ] Test loading indicator
- [ ] Test error handling

---

## 📚 Related Documentation

- [Wheel of Fortune Documentation](./WHEEL_OF_FORTUNE_DOCUMENTATION.md)
- [Database Schema Documentation](../mywebsite-backend/database/SUPABASE_DATABASE_SCHEMA.md)
- [Backend README](../mywebsite-backend/README.md)

---

*Last updated: 2025*

