import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import './ContestList.css'; 

const API_URL = 'https://clist.by/api/v1/contest/';
const API_KEY = 'saurabh.kaushik_:2b65af74b51a252a13b589a291b5d7a652b987fd';

const allowedPlatforms = [
    'codingninjas.com/codestudio',
    'codeforces.com',
    'atcoder.jp',
    'leetcode.com',
    'geeksforgeeks.org',
    'codechef.com',
    'projecteuler.net'
];

const logo = new Map();
logo.set('atcoder.jp', '/images/atcoder.png');
logo.set('leetcode.com', '/images/leetcode.png');
logo.set('codeforces.com', '/images/codeforces.png');
logo.set('codechef.com', '/images/codechef.png');
logo.set('geeksforgeeks.org', '/images/geeksforgeeks.png');
logo.set('codingninjas.com/codestudio', '/images/codingNinja.png');
logo.set('projecteuler.net','/images/euler.jpg');

const ContestList = () => {
    const [contests, setContests] = useState([]);
    const [uniquePlatforms, setUniquePlatforms] = useState([]);
    const [filteredPlatform, setFilteredPlatform] = useState('all');
    const [reminderButtons, setReminderButtons] = useState({});

    useEffect(() => {
        fetchContests();
    }, []);

    useEffect(() => {
        const platformFilter = document.getElementById('platform-filter');
        const contestCards = document.querySelectorAll('.contest-card');

        const handlePlatformChange = (e) => {
            const selectedPlatform = e.target.value;
            contestCards.forEach(card => {
                if (selectedPlatform === 'all' || card.getAttribute('data-platform') === selectedPlatform) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        platformFilter.addEventListener('change', handlePlatformChange);

        return () => {
            platformFilter.removeEventListener('change', handlePlatformChange);
        };
    }, []);

    const fetchContests = async () => {
        const currentDateTime = new Date().toISOString();
        const oneMonthFromNow = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString();
        const url = `${API_URL}?username=${API_KEY.split(':')[0]}&api_key=${API_KEY.split(':')[1]}&order_by=start&start__gt=${currentDateTime}&start__lt=${oneMonthFromNow}`;
        
        const { data } = await axios.get(url);

        const contests = data.objects
            .filter(contest => allowedPlatforms.includes(contest.resource.name))
            .map(contest => {
                let start_date_gmt = moment.utc(contest.start, 'YYYY-MM-DD HH:mm:ss');
                let end_date_gmt = moment.utc(contest.end, 'YYYY-MM-DD HH:mm:ss');
                let start_date_ist = start_date_gmt.clone().tz('Asia/Kolkata');
                let end_date_ist = end_date_gmt.clone().tz('Asia/Kolkata');

                return {
                    id: contest.id,
                    name: contest.event,
                    start_date: start_date_ist.format('YYYY-MM-DD HH:mm:ss'),
                    end_date: end_date_ist.format('YYYY-MM-DD HH:mm:ss'),
                    duration: contest.duration,
                    platform: contest.resource.name,
                    link: contest.href
                };
            });

        setContests(contests);
        setUniquePlatforms([...new Set(contests.map(contest => contest.platform))]);
    };

    const splitDateTime = (dateTime) => {
        const [date, time] = dateTime.split(' ');
        return { date, time };
    };

    const handleSetReminder = (id, name, startDate, link) => {
        const startDateObj = new Date(startDate);
        const reminderDate = new Date(startDateObj.getTime() - 2 * 60 * 1000); // 2 minutes before start time

        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const existingReminder = reminders.find(r => r.id === id);
        const reminderButton = document.getElementById(`reminder-btn-${id}`);
        if (existingReminder) {
            if (reminderButton) {
                reminderButton.innerText = 'Reminder Set';
                reminderButton.style.background = '#bdce00';
                reminderButton.disabled = true;
            }
            alert('Reminder already set for this contest!');
            setReminderButtons(prevButtons => ({
                ...prevButtons,
                [id]: true
            }));
        } else {
            const newReminder = {
                id,
                name,
                startDate: reminderDate,
                link
            };
            
            reminders.push(newReminder);
            localStorage.setItem('reminders', JSON.stringify(reminders));

            setReminderButtons(prevButtons => ({
                ...prevButtons,
                [id]: true
            }));

            if (reminderButton) {
                reminderButton.innerText = 'Reminder Set';
                reminderButton.style.background = '#bdce00';
                reminderButton.disabled = true;
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
            const currentDateTime = new Date();

            const remainingReminders = reminders.filter(reminder => {
                const reminderDate = new Date(reminder.startDate);

                if (currentDateTime.getTime() >= reminderDate.getTime()) {
                    alert(`Reminder: ${reminder.name} is starting soon!\nContest link: ${reminder.link}`);
                    return false; // Remove this reminder
                }
                return true; // Keep this reminder
            });

            localStorage.setItem('reminders', JSON.stringify(remainingReminders));
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='contests-list'>
            <label htmlFor="platform-filter" className="block font-semibold text-gray-700 mb-2 text-lg">
                Filter by platform:
            </label>
            <select
                id="platform-filter"
                onChange={(e) => setFilteredPlatform(e.target.value)}
                className="mb-6 p-2 border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="all">All</option>
                {uniquePlatforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                ))}
            </select>

            <div
                id="contests"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {contests.filter(contest => filteredPlatform === 'all' || contest.platform === filteredPlatform).map(contest => (
                    <div
                        key={contest.id}
                        className="contest-card bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
                        data-platform={contest.platform}
                    >
                        <div className='card-text mb-4'>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{contest.name}</h2>
                            <p className="text-gray-700">
                                <span className="block">
                                    Start: <span className="font-mono">{splitDateTime(contest.start_date).date}</span> <span className="font-mono">{splitDateTime(contest.start_date).time}</span>
                                </span>
                                <span className="block">
                                    End: <span className="font-mono">{splitDateTime(contest.end_date).date}</span> <span className="font-mono">{splitDateTime(contest.end_date).time}</span>
                                </span>
                            </p>
                        </div>
                        <div className='logoo mb-4 flex justify-center'>
                            {logo.has(contest.platform) ? (
                                <img src={logo.get(contest.platform)} alt={contest.platform} className="w-12 h-12 object-contain" />
                            ) : (
                                <span className="text-gray-600">{contest.platform}</span>
                            )}
                        </div>
                        <a
                            href={contest.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline mb-4 block text-center font-semibold"
                        >
                            Contest Link
                        </a>
                        <button
                            onClick={() => handleSetReminder(contest.id, contest.name, contest.start_date, contest.link)}
                            disabled={reminderButtons[contest.id]}
                            className={`bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-md py-2 px-4 text-sm font-semibold cursor-pointer transition duration-300 ease-in-out ${
                                reminderButtons[contest.id] ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
                            }`}
                            id={`reminder-btn-${contest.id}`}
                        >
                            {reminderButtons[contest.id] ? 'Reminder Set' : 'Set Reminder'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContestList;
