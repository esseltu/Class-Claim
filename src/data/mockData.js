import { format } from 'date-fns';

export const ROOMS = {
  'Block B': [
    'LT-B01',
    'LT-B03'
  ],
  'Block C': [
    'LT-C01',
    'LT-C02'
  ],
  'Block E': [
    '101A (Chem Lab)',
    '103A (Block E)',
    '201A',
    '202A',
    '203A',
    '204A',
    '301A (Block E)',
    '302A',
    '303A',
    '304A'
  ],
  'Block F': [
    '101',
    '102A',
    '102B',
    '103A (Block F)',
    '103B',
    '104A',
    '104B',
    '201',
    '202',
    '301A (Block F)',
    '301B',
    '302',
    '303',
    '304',
    '401',
    '402 (IT Lab)'
  ]
};

export const getRoomDisplayName = (room) =>
  room
    .replace(' (Block E)', '')
    .replace(' (Block F)', '')
    .replace(' (Architecture Floor)', '');

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
    room: '101A (Chem Lab)',
    date: today,
    slot: '07:00 - 09:00',
    courseCode: 'PSYC 201',
    bookedBy: 'John',
    timestamp: Date.now()
  },
  {
    id: '2',
    room: '104A',
    date: today,
    slot: '09:00 - 11:00',
    courseCode: 'COMM 101',
    bookedBy: 'Sarah',
    timestamp: Date.now()
  }
];
