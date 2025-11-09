"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tailwind CSS v4 + shadcn/ui Test Page
          </h1>
          <p className="text-gray-600">
            This page verifies that Tailwind CSS v4 and shadcn/ui components are working correctly.
          </p>
        </div>

        {/* Color Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Red Card</h2>
            <p className="text-red-100">bg-red-500</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Green Card</h2>
            <p className="text-green-100">bg-green-500</p>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Blue Card</h2>
            <p className="text-blue-100">bg-blue-500</p>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Typography Test</h2>
          <p className="text-lg text-gray-700 mb-2">
            This is a large paragraph with <span className="font-bold">bold text</span> and{" "}
            <span className="italic">italic text</span>.
          </p>
          <p className="text-base text-gray-600">
            This is a regular paragraph with normal text size.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This is a small paragraph with smaller text.
          </p>
        </div>

        {/* shadcn/ui Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui Button Components</CardTitle>
            <CardDescription>Different button variants from shadcn/ui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button disabled>Disabled</Button>
              <Button variant="default" disabled>
                Disabled Default
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* shadcn/ui Input & Label */}
        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui Input & Label Components</CardTitle>
            <CardDescription>Form input components from shadcn/ui</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">Disabled Input</Label>
              <Input id="disabled" placeholder="Disabled input" disabled />
            </div>
          </CardContent>
        </Card>

        {/* shadcn/ui Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a shadcn/ui Card component with header, content, and footer.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Card Action
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>Demonstrating card variations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards are great for organizing content into distinct sections.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="default" size="sm">
                Primary
              </Button>
              <Button variant="outline" size="sm">
                Secondary
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Plain HTML Buttons (for comparison) */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Plain HTML Buttons (Comparison)</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
              Secondary Button
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors">
              Outline Button
            </button>
          </div>
        </div>

        {/* Spacing & Layout */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Spacing & Layout</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-purple-500 rounded"></div>
            <div className="w-16 h-16 bg-pink-500 rounded"></div>
            <div className="w-16 h-16 bg-yellow-500 rounded"></div>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsive Grid</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="bg-indigo-100 border-2 border-indigo-300 rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-indigo-700">Item {num}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Message */}
        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-sm text-green-700">
              <span className="font-semibold">✓ Tailwind CSS v4 and shadcn/ui are working!</span>
              <br />
              If you can see styled elements and components above, everything is properly configured.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

