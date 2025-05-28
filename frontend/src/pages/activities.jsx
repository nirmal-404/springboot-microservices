import { Card } from "@/components/ui/card";
import ActivityList from "@/components/view/ActivityList";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import ActivityForm from "@/components/view/ActivityForm";

function ActivityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">Your Fitness Journey</h1>
            <p className="text-lg text-gray-600">Track and analyze your activities</p>
          </motion.div>
          
          <Sheet>
            <SheetTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Activity
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Log New Activity</SheetTitle>
              </SheetHeader>
              <div className="py-6 px-3 w-full">
                <ActivityForm onActivityAdded={() => window.location.reload()} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white rounded-xl shadow-sm border-0">
            <ActivityList />
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ActivityPage;