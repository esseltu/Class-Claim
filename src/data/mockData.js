import { format } from 'date-fns';

export const ROOMS = {
  'Block E': [
    'E101', 'E102', 'E103', 'E104',
    'E201', 'E202', 'E203', 'E204',
    'E301', 'E302', 'E303', 'E304'
  ],
  'Block F': [
    'F102', 'F103', 'F104',
    'F201', 'F202',
    'F301', 'F302', 'F303', 'F304',
    'F403', 'F404'
  ]
};

export const TIME_SLOTS = [
  '07:00 - 09:00',
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00'
];

const today = format(new Date(), 'yyyy-MM-dd');

export const INITIAL_BOOKINGS = [
  {
    id: '1',
    room: 'E101',
    date: today,
    slot: '07:00 - 09:00',
    courseCode: 'PSYC 201',
    bookedBy: 'John',
    timestamp: Date.now()
  },
  {
    id: '2',
    room: 'F102',
    date: today,
    slot: '09:00 - 11:00',
    courseCode: 'COMM 101',
    bookedBy: 'Sarah',
    timestamp: Date.now()
  }
];
