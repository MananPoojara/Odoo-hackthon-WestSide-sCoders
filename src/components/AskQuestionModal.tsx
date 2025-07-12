
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/RichTextEditor";
import { X } from "lucide-react";

interface AskQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AskQuestionModal = ({ open, onOpenChange }: AskQuestionModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim() && tags.length > 0) {
      // Handle question submission
      console.log({ title, content, tags });
      onOpenChange(false);
      // Reset form
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's your programming question? Be specific."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              Be specific and clear. Good titles get better answers.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Provide details about your question. Include code examples, error messages, and what you've tried."
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="space-y-2">
              <Input
                id="tags"
                placeholder="Add tags (press Enter or comma to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Add up to 5 tags to help others find your question. Use existing tags when possible.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || tags.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Post Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
