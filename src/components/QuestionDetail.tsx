
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { RichTextEditor } from "@/components/RichTextEditor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ArrowLeft, 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  Check,
  Share,
  Bookmark,
  Home
} from "lucide-react";

interface QuestionDetailProps {
  question: any;
  onBack: () => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

const mockAnswers = [
  {
    id: 1,
    content: "For JWT authentication in React, I recommend using a combination of localStorage for token storage and React Context for state management. Here's a complete approach:\n\n**1. Create an Auth Context:**\n```javascript\nconst AuthContext = createContext();\n```\n\n**2. Store tokens securely:**\n- Use httpOnly cookies for production\n- localStorage for development\n\n**3. Implement token refresh logic:**\nAlways refresh tokens before they expire to maintain user sessions.",
    author: "alex_senior",
    authorAvatar: "",
    votes: 12,
    isAccepted: true,
    createdAt: "1 hour ago",
    comments: 2
  },
  {
    id: 2,
    content: "I'd suggest using a library like `@auth0/auth0-react` or `react-query` with custom hooks for authentication. This approach provides:\n\n- Automatic token refresh\n- Better error handling\n- TypeScript support\n- Built-in security best practices\n\nHere's a simple custom hook example:\n```typescript\nconst useAuth = () => {\n  // Implementation here\n};\n```",
    author: "emma_react",
    authorAvatar: "",
    votes: 8,
    isAccepted: false,
    createdAt: "30 minutes ago",
    comments: 1
  }
];

export const QuestionDetail = ({ question, onBack, isLoggedIn, onAuthRequired }: QuestionDetailProps) => {
  const [userVotes, setUserVotes] = useState({});
  const [answerContent, setAnswerContent] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleVote = (answerId: number, type: 'up' | 'down') => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    
    setUserVotes(prev => ({
      ...prev,
      [answerId]: prev[answerId] === type ? null : type
    }));
  };

  const handleAcceptAnswer = (answerId: number) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    console.log('Accepting answer:', answerId);
  };

  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) return;
    
    console.log('Submitting answer:', answerContent);
    setAnswerContent("");
    setShowAnswerForm(false);
  };

  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-foreground">StackIt</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack} className="cursor-pointer flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Questions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {question.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-8">
          <div className="flex-1">
            {/* Question */}
            <Card className="mb-8 border-border">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(question.id, 'up')}
                      className={`p-2 ${userVotes[question.id] === 'up' ? 'text-primary bg-primary/10' : 'hover:bg-muted'}`}
                    >
                      <ChevronUp className="w-6 h-6" />
                    </Button>
                    <span className="font-bold text-xl text-foreground">{question.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(question.id, 'down')}
                      className={`p-2 ${userVotes[question.id] === 'down' ? 'text-destructive bg-destructive/10' : 'hover:bg-muted'}`}
                    >
                      <ChevronDown className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground mb-4">{question.title}</h1>
                    
                    <div 
                      className="prose max-w-none mb-6 text-foreground"
                      dangerouslySetInnerHTML={{ __html: renderContent(question.content) }}
                    />

                    <div className="flex flex-wrap gap-2 mb-6">
                      {question.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>asked {question.createdAt}</span>
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {question.author.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{question.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {mockAnswers.length} Answer{mockAnswers.length !== 1 ? 's' : ''}
              </h2>

              <div className="space-y-6">
                {mockAnswers.map((answer) => (
                  <Card key={answer.id} className={`border-border ${answer.isAccepted ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Vote Section */}
                        <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(answer.id, 'up')}
                            className={`p-2 ${userVotes[answer.id] === 'up' ? 'text-primary bg-primary/10' : 'hover:bg-muted'}`}
                          >
                            <ChevronUp className="w-6 h-6" />
                          </Button>
                          <span className="font-bold text-xl text-foreground">{answer.votes}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(answer.id, 'down')}
                            className={`p-2 ${userVotes[answer.id] === 'down' ? 'text-destructive bg-destructive/10' : 'hover:bg-muted'}`}
                          >
                            <ChevronDown className="w-6 h-6" />
                          </Button>
                          
                          {answer.isAccepted ? (
                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAcceptAnswer(answer.id)}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/50"
                              title="Accept this answer"
                            >
                              <Check className="w-5 h-5" />
                            </Button>
                          )}
                        </div>

                        {/* Answer Content */}
                        <div className="flex-1">
                          {answer.isAccepted && (
                            <div className="flex items-center gap-2 mb-4">
                              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-green-600 dark:text-green-400 font-medium text-sm">Accepted Answer</span>
                            </div>
                          )}
                          
                          <div 
                            className="prose max-w-none mb-6 text-foreground"
                            dangerouslySetInnerHTML={{ __html: renderContent(answer.content) }}
                          />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                {answer.comments} comments
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>answered {answer.createdAt}</span>
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {answer.author.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{answer.author}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Answer Form */}
            <Card className="border-border">
              <CardContent className="p-6">
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Your Answer</h3>
                    {showAnswerForm ? (
                      <div className="space-y-4">
                        <RichTextEditor
                          content={answerContent}
                          onChange={setAnswerContent}
                          placeholder="Write your answer here..."
                        />
                        <div className="flex space-x-3">
                          <Button 
                            onClick={handleSubmitAnswer}
                            disabled={!answerContent.trim()}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Post Answer
                          </Button>
                          <Button variant="outline" onClick={() => setShowAnswerForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setShowAnswerForm(true)}>
                        Write an Answer
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You need to be logged in to answer questions.</p>
                    <Button onClick={onAuthRequired} className="bg-primary hover:bg-primary/90">
                      Login to Answer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-foreground">Related Questions</h3>
                <div className="space-y-3">
                  <a href="#" className="block text-sm text-primary hover:underline">
                    How to handle authentication in Next.js?
                  </a>
                  <a href="#" className="block text-sm text-primary hover:underline">
                    Best practices for storing JWT tokens
                  </a>
                  <a href="#" className="block text-sm text-primary hover:underline">
                    React Context vs Redux for auth state
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
