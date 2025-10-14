export interface TrackerData {
  fasting: {
    startTime: number | null;
    goalHours: number;
    isActive: boolean;
    completedHours: number;
  };
  water: {
    current: number;
    target: number;
    history: number[];
  };
  sleep: {
    hoursSlept: number;
    target: number;
  };
  mindfulness: {
    minutes: number;
    target: number;
    isComplete: boolean;
  };
  steps: {
    current: number;
    target: number;
    history: number[];
  };
}

export const defaultTrackerData: TrackerData = {
  fasting: {
    startTime: null,
    goalHours: 16,
    isActive: false,
    completedHours: 0,
  },
  water: {
    current: 0,
    target: 2500,
    history: [],
  },
  sleep: {
    hoursSlept: 0,
    target: 8,
  },
  mindfulness: {
    minutes: 0,
    target: 20,
    isComplete: false,
  },
  steps: {
    current: 0,
    target: 10000,
    history: [],
  },
};
