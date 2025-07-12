
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

interface FilterDropdownProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
  onClose: () => void;
}

const popularTags = ["React", "JavaScript", "TypeScript", "Node.js", "CSS", "HTML", "Python", "Authentication"];

export const FilterDropdown = ({ sortBy, setSortBy, filterTag, setFilterTag, onClose }: FilterDropdownProps) => {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4 w-80">
        <Card className="border-border bg-card shadow-lg">
          <CardHeader>
            <h3 className="font-semibold text-foreground">Filter & Sort</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sort Options */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Sort by</h4>
              <div className="space-y-1">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "votes", label: "Most Votes" },
                  { value: "answers", label: "Most Answers" }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-between ${
                      sortBy === option.value ? "bg-primary/10 text-primary" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortBy(option.value);
                    }}
                  >
                    {option.label}
                    {sortBy === option.value && <Check className="w-4 h-4" />}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Filter by tag</h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={filterTag === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterTag("");
                  }}
                >
                  All
                </Badge>
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filterTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterTag(tag);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
