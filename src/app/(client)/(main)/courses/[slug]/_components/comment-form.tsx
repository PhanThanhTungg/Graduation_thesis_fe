"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function CommentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    saveInfo: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="mt-10 border-t border-border pt-10">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground capitalize mb-2">
          Leave a comment
        </h3>
        <p className="text-base text-muted-foreground">
          Your email address will not be published. Required fields are marked *
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Name*"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <Input
            type="email"
            placeholder="Email*"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        {/* Comment Textarea */}
        <Textarea
          placeholder="Comment"
          value={formData.comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          rows={5}
          className="resize-none"
        />

        {/* Save Info Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={formData.saveInfo}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, saveInfo: checked as boolean })
            }
          />
          <span className="text-base text-foreground">
            Save my name, email in this browser for the next time I comment
          </span>
        </label>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="bg-orange hover:bg-orange/90 text-white rounded-3xl px-8"
        >
          Post Comment
        </Button>
      </form>
    </div>
  );
}
