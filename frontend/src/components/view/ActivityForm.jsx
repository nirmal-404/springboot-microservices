import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue,
} from "../ui/select";
import { addActivity } from "@/services/api";
import { Dumbbell, Zap, Footprints, Flame, Clock, Bike, Waves, Leaf, HeartPulse, Move, CircleDashed } from "lucide-react";
import { motion } from "framer-motion";

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

function ActivityForm({ onActivityAdded }) {
    const [activity, setActivity] = useState({
        type: "",
        duration: '',
        caloriesBurnt: '',
        additionalMetrics: {}
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivity((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await addActivity(activity);
            onActivityAdded();
            setActivity({
                type: "",
                duration: '',
                caloriesBurnt: '',
                additionalMetrics: {}
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={formVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Label htmlFor="type" className="text-gray-700">Activity Type</Label>
                <Select
                    value={activity.type}
                    onValueChange={(value) => setActivity({ ...activity, type: value })}
                >
                    <SelectTrigger className="w-full h-12 mt-2">
                        <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="RUNNING" className="flex items-center gap-2">
                            <Zap className="h-4 w-4" /> Running
                        </SelectItem>

                        <SelectItem value="WALKING" className="flex items-center gap-2">
                            <Footprints className="h-4 w-4" /> Walking
                        </SelectItem>

                        <SelectItem value="CYCLING" className="flex items-center gap-2">
                            <Bike className="h-4 w-4" /> Cycling
                        </SelectItem>

                        <SelectItem value="SWIMMING" className="flex items-center gap-2">
                            <Waves className="h-4 w-4" /> Swimming
                        </SelectItem>

                        <SelectItem value="WEIGHT_TRAINING" className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4" /> Weight Training
                        </SelectItem>

                        <SelectItem value="YOGA" className="flex items-center gap-2">
                            <Leaf className="h-4 w-4" /> Yoga
                        </SelectItem>

                        <SelectItem value="HIIT" className="flex items-center gap-2">
                            <Flame className="h-4 w-4" /> HIIT
                        </SelectItem>

                        <SelectItem value="CARDIO" className="flex items-center gap-2">
                            <HeartPulse className="h-4 w-4" /> Cardio
                        </SelectItem>

                        <SelectItem value="STRETCHING" className="flex items-center gap-2">
                            <Move className="h-4 w-4" /> Stretching
                        </SelectItem>

                        <SelectItem value="OTHER" className="flex items-center gap-2">
                            <CircleDashed className="h-4 w-4" /> Other
                        </SelectItem>

                    </SelectContent>
                </Select>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                    <Label htmlFor="duration" className="text-gray-700">Duration</Label>
                    <div className="relative mt-2">
                        <Input
                            id="duration"
                            name="duration"
                            type="number"
                            min="0"
                            value={activity.duration}
                            onChange={handleChange}
                            className="h-12 pl-10"
                            placeholder="30"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Label htmlFor="caloriesBurnt" className="text-gray-700">Calories</Label>
                    <div className="relative mt-2">
                        <Input
                            id="caloriesBurnt"
                            name="caloriesBurnt"
                            type="number"
                            min="0"
                            value={activity.caloriesBurnt}
                            onChange={handleChange}
                            className="h-12 pl-10"
                            placeholder="250"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Flame className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div variants={itemVariants}>
                <Button
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Log Activity"
                    )}
                </Button>
            </motion.div>
        </motion.form>
    );
}

export default ActivityForm;