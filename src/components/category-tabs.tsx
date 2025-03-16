"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryTabsProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="mt-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-rose-800">Menu</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={onSelectCategory} className="w-full">
        <TabsList className="w-full bg-rose-50 p-1 h-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm text-rose-500 py-2"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

