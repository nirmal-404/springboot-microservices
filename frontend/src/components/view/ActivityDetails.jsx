import { getActivityDetails } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Zap, Footprints, Dumbbell, Clock, Bike, Waves, Leaf, Flame, HeartPulse, Move, CircleDashed, Activity, Calendar, TrendingUp, Shield, } from "lucide-react";

import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function ActivityDetails() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchActivityDetails = async (id) => {
        try {
            setLoading(true);
            const response = await getActivityDetails(id);
            setActivity(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityDetails(id);
    }, [id]);

    const activityIcons = {
        RUNNING: <Zap className="h-5 w-5 text-indigo-600" />,
        WALKING: <Footprints className="h-5 w-5 text-blue-600" />,
        CYCLING: <Bike className="h-5 w-5 text-yellow-600" />,
        SWIMMING: <Waves className="h-5 w-5 text-cyan-600" />,
        WEIGHT_TRAINING: <Dumbbell className="h-5 w-5 text-purple-600" />,
        YOGA: <Leaf className="h-5 w-5 text-emerald-600" />,
        HIIT: <Flame className="h-5 w-5 text-red-600" />,
        CARDIO: <HeartPulse className="h-5 w-5 text-pink-600" />,
        STRETCHING: <Move className="h-5 w-5 text-orange-600" />,
        OTHER: <CircleDashed className="h-5 w-5 text-gray-600" />,
    };

    const activityColors = {
        RUNNING: "bg-indigo-100",
        WALKING: "bg-blue-100",
        CYCLING: "bg-yellow-100",
        SWIMMING: "bg-cyan-100",
        WEIGHT_TRAINING: "bg-purple-100",
        YOGA: "bg-emerald-100",
        HIIT: "bg-red-100",
        CARDIO: "bg-pink-100",
        STRETCHING: "bg-orange-100",
        OTHER: "bg-gray-100",
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Loading skeleton */}
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Activity Details</h1>
                <p className="text-gray-600">Review your workout session and AI recommendations</p>
            </motion.div>

            <div className="grid gap-6">
                <motion.div variants={itemVariants}>
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <motion.div
                                className={`p-3 rounded-full ${activityColors[activity?.type]}`}
                                whileHover={{ rotate: 10 }}
                            >
                                {activityIcons[activity?.type]}
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-semibold capitalize">{activity?.type?.toLowerCase()}</h2>
                                <p className="text-gray-500">
                                    {new Date(activity?.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div className="space-y-4" variants={itemVariants}>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-medium">{activity?.duration} minutes</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Flame className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Calories Burned</p>
                                        <p className="font-medium">{activity?.caloriesBurnt} kcal</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div className="space-y-4" variants={itemVariants}>
                                <div className="flex items-center gap-3">
                                    <Activity className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Intensity</p>
                                        <Badge variant="outline" className="text-sm">
                                            {activity?.intensity || 'Moderate'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date Recorded</p>
                                        <p className="font-medium">
                                            {new Date(activity?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>

                {activity?.recommendation && (
                    <motion.div variants={itemVariants}>
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Zap className="h-6 w-6 text-yellow-500" />
                                </motion.div>
                                <h2 className="text-xl font-semibold">AI Recommendations</h2>
                            </div>

                            <motion.div className="space-y-6" variants={containerVariants}>
                                <motion.div variants={itemVariants}>
                                    <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                        Analysis Summary
                                    </h3>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                        {activity?.recommendation}
                                    </p>
                                </motion.div>

                                <Separator />

                                <motion.div variants={itemVariants}>
                                    <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                                        <TrendingUp className="h-5 w-5 text-blue-500" />
                                        Suggested Improvements
                                    </h3>
                                    <ul className="space-y-3">
                                        {activity?.improvements?.map((improvement, index) => (
                                            <motion.li
                                                key={index}
                                                className="flex items-start gap-3"
                                                whileHover={{ x: 5 }}
                                            >
                                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                                                    {index + 1}
                                                </span>
                                                <p className="text-gray-700">{improvement}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <Separator />

                                <motion.div variants={itemVariants}>
                                    <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                                        <Shield className="h-5 w-5 text-orange-500" />
                                        Safety Tips
                                    </h3>
                                    <ul className="space-y-3">
                                        {activity?.safety?.map((safetyPoint, index) => (
                                            <motion.li
                                                key={index}
                                                className="flex items-start gap-3"
                                                whileHover={{ x: 5 }}
                                            >
                                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600">
                                                    {index + 1}
                                                </span>
                                                <p className="text-gray-700">{safetyPoint}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </motion.div>
                        </Card>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default ActivityDetails;