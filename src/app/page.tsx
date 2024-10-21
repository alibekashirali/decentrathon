import Layout from './layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Puzzle, Hash, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Sequence Learning',
  description: 'Learn about sequences in a fun way!',
};

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Puzzle className="mr-2 h-6 w-6" />
          Sequence Safari
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Arrange animal life stages in the correct order.</p>
        <Link href="/sequence-safari">
          <Button>Play Now</Button>
        </Link>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Hash className="mr-2 h-6 w-6" />
          Number Sequencer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Order numbers in ascending sequence.</p>
        <Link href="/number-sequencer">
          <Button>Play Now</Button>
        </Link>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-6 w-6" />
          Fairy Tale Arranger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Arrange story events in the correct order.</p>
        <Link href="/fairy-tale-arranger">
          <Button>Play Now</Button>
        </Link>
      </CardContent>
    </Card>
  </div>
  )
}