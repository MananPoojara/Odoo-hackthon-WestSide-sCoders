
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Plus, ChevronUp, ChevronDown, MessageSquare, Search, User, Settings, LogOut, LogIn, UserPlus, Moon, Sun, Filter } from "lucide-react";
import { AskQuestionModal } from "@/components/AskQuestionModal";
import { QuestionDetail } from "@/components/QuestionDetail";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { AuthModal } from "@/components/AuthModal";
import { FilterDropdown } from "@/components/FilterDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTheme } from "next-themes";

const mockQuestions = [
  {
    id: 1,
    title: "How to implement JWT authentication in React?",
    content: "I'm building a React application and need to implement JWT authentication. What's the best approach for storing tokens and handling authentication state?",
    author: "john_dev",
    authorAvatar: "",
    votes: 15,
    answers: 3,
    tags: ["React", "JWT", "Authentication"],
    createdAt: "2 hours ago",
    hasAcceptedAnswer: true
  },
  {
    id: 2,
    title: "Best practices for TypeScript with React hooks?",
    content: "What are the recommended TypeScript patterns when working with React hooks? I'm particularly interested in custom hooks and state management.",
    author: "sarah_codes",
    authorAvatar: "",
    votes: 23,
    answers: 7,
    tags: ["TypeScript", "React", "Hooks"],
    createdAt: "4 hours ago",
    hasAcceptedAnswer: false
  },
  {
    id: 3,
    title: "How to optimize Tailwind CSS bundle size?",
    content: "My production build is getting quite large due to Tailwind CSS. What are the best methods to reduce the bundle size while keeping the design system intact?",
    author: "mike_designer",
    authorAvatar: "",
    votes: 8,
    answers: 2,
    tags: ["Tailwind", "CSS", "Performance"],
    createdAt: "6 hours ago",
    hasAcceptedAnswer: false
  },
  {
    id: 4,
    title: "React Query vs SWR for data fetching?",
    content: "I'm trying to decide between React Query and SWR for my next project. What are the main differences and which one would you recommend?",
    author: "dev_anna",
    authorAvatar: "",
    votes: 12,
    answers: 5,
    tags: ["React", "Data Fetching", "Performance"],
    createdAt: "8 hours ago",
    hasAcceptedAnswer: true
  },
  {
    id: 5,
    title: "How to handle state management in large React apps?",
    content: "As my React application grows, state management becomes more complex. What are the best patterns and tools for managing state in large applications?",
    author: "team_lead",
    authorAvatar: "",
    votes: 31,
    answers: 12,
    tags: ["React", "State Management", "Architecture"],
    createdAt: "1 day ago",
    hasAcceptedAnswer: false
  }
];

const QUESTIONS_PER_PAGE = 3;

const Index = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleVote = (questionId, type) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    setUserVotes(prev => ({
      ...prev,
      [questionId]: type
    }));
  };

  const handleAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserVotes({});
  };

  // Filter and sort questions
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || question.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case "votes":
        return b.votes - a.votes;
      case "answers":
        return b.answers - a.answers;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = sortedQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (selectedQuestion) {
    return (
      <QuestionDetail
        question={selectedQuestion}
        onBack={() => setSelectedQuestion(null)}
        isLoggedIn={isLoggedIn}
        onAuthRequired={() => setShowAuthModal(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-foreground">StackIt</span>
              </div>
              
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search questions..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="relative"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>

              <Button 
                onClick={() => isLoggedIn ? setShowAskModal(true) : setShowAuthModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
                {showNotifications && (
                  <NotificationDropdown onClose={() => setShowNotifications(false)} />
                )}
              </div>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => handleAuth("login")}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button variant="outline" onClick={() => handleAuth("register")}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Questions List */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Latest Questions</h1>
                  <p className="text-muted-foreground">Get help from the community</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    {showFilter && (
                      <FilterDropdown
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        filterTag={filterTag}
                        setFilterTag={setFilterTag}
                        onClose={() => setShowFilter(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {paginatedQuestions.map((question) => (
                <Card 
                  key={question.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer border-border"
                  onClick={() => setSelectedQuestion(question)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(question.id, 'up');
                          }}
                          className={`p-1 ${userVotes[question.id] === 'up' ? 'text-primary bg-primary/10' : 'hover:bg-muted'}`}
                        >
                          <ChevronUp className="w-5 h-5" />
                        </Button>
                        <span className="font-semibold text-lg text-foreground">{question.votes}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(question.id, 'down');
                          }}
                          className={`p-1 ${userVotes[question.id] === 'down' ? 'text-destructive bg-destructive/10' : 'hover:bg-muted'}`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                            {question.title}
                          </h3>
                          {question.hasAcceptedAnswer && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ml-2">
                              ✓ Solved
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">{question.content}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{question.answers} answers</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {question.author.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>by {question.author}</span>
                            </div>
                          </div>
                          <span>{question.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="border-border">
              <CardHeader>
                <h3 className="font-semibold text-foreground">Popular Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["React", "JavaScript", "TypeScript", "Node.js", "CSS", "HTML", "Python", "Authentication"].map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="hover:bg-muted cursor-pointer"
                      onClick={() => setFilterTag(filterTag === tag ? "" : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 border-border">
              <CardHeader>
                <h3 className="font-semibold text-foreground">Community Stats</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-semibold text-foreground">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Answers</span>
                  <span className="font-semibold text-foreground">4,567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-semibold text-foreground">890</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AskQuestionModal 
        open={showAskModal} 
        onOpenChange={setShowAskModal}
      />
      
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        mode={authMode}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
