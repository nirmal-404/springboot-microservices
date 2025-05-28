import { getActivities } from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Zap, Footprints, Dumbbell, Clock, Bike, Waves, Leaf, Flame, HeartPulse, Move, CircleDashed, } from "lucide-react";
import { Badge } from "../ui/badge";

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Activities</h2>
        <p className="text-gray-500">{activities.length} records</p>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No activities logged yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card 
              key={activity.id} 
              onClick={() => navigate(`/activities/${activity.id}`)}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border-gray-200 h-full"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-full ${activityColors[activity.type]}`}>
                    {activityIcons[activity.type]}
                  </div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {activity.type.toLowerCase()}
                  </h3>
                </div>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{activity.duration} minutes</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Flame className="h-4 w-4 mr-2" />
                    <span>{activity.caloriesBurnt} calories burned</span>
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className="mt-4 w-fit text-gray-600 hover:bg-gray-50"
                >
                  View Details
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityList;